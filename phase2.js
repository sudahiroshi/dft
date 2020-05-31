"use strict";

class Phase {
  constructor() {
    this.data = {
      freq: 440,
      amp: 0.5,
      member: { 1: 0.5, 2: 0 },
      sec: 1,
      phase: { 1: 0, 2: 0 },
    };
    this.wave = new Wave();
    this.vc1 = new VCanvas(document.getElementById("canvas1"));
  }

  graph() {
      let wave = this.wave;
      let data = this.data;
      wave.synthesize( data.freq, data.amp, data.member, data.sec, data.phase );
    // 仮想座標対応Canvasの初期化
    let vc1 = this.vc1;
    vc1.forecolor(0, 0, 0);
    let plotnumber = (wave.data.length * wave.area) / 100;
    vc1.cls(); // 描画内容の消去

    // X軸とY軸の描画
    vc1.scale(0, 1, plotnumber, -2);
    vc1.beginPath(); // 描画開始の宣言
    vc1.line(0, 0, wave.data.length, 0);
    vc1.line(0, -1, 0, 1);
    for (let i = 0; i < plotnumber; i += wave.skip * 100) {
      vc1.print(i, 0, i);
    }
    vc1.stroke(); // 描画

    // dataの内容の描画
    vc1.beginPath(); // 描画開始の宣言
    vc1.lineStart(0, 0); // 始点の設定
    for (let i = 0; i < plotnumber; i += wave.skip) {
      vc1.lineto(i, wave.data[i]);
    }
    vc1.stroke(); // 描画
  }

  setPhase( number, phase ) {
    this.data["phase"][number] = phase/180.0*Math.PI;
  }

  setAmp( number, amp ) {
      this.data["member"][number] = amp;
  }

}

class Phase2 {
    constructor() {
      this.data = {
        freq: 440,
        amp: 0.5,
        member: { 1: { "sin":0.5, "cos":0 }, 2: {"sin":0, "cos":0} },
        sec: 1,
      };
      this.wave = new Wave();
      this.vc1 = new VCanvas(document.getElementById("canvas2"));
    }

    graph() {
        let wave = this.wave;
        let data = this.data;
        wave.synthesize2( data.freq, data.amp, data.member, data.sec );
      // 仮想座標対応Canvasの初期化
      let vc1 = this.vc1;
      vc1.forecolor(0, 0, 0);
      let plotnumber = (wave.data.length * wave.area) / 100;
      vc1.cls(); // 描画内容の消去

      // X軸とY軸の描画
      vc1.scale(0, 1, plotnumber, -2);
      vc1.beginPath(); // 描画開始の宣言
      vc1.line(0, 0, wave.data.length, 0);
      vc1.line(0, -1, 0, 1);
      for (let i = 0; i < plotnumber; i += wave.skip * 100) {
        vc1.print(i, 0, i);
      }
      vc1.stroke(); // 描画

      // dataの内容の描画
      vc1.beginPath(); // 描画開始の宣言
      vc1.lineStart(0, 0); // 始点の設定
      for (let i = 0; i < plotnumber; i += wave.skip) {
        vc1.lineto(i, wave.data[i]);
      }
      vc1.stroke(); // 描画
    }

    setAmp( number, elm, amp ) {
        this.data["member"][number][elm] = amp;
    }

  }
window.addEventListener("load", () => {


  // サンプリング周波数44.1kHz，モノラルとして初期化する

    // 波形データを初期化
    let phase = new Phase(  );
    let phase2 = new Phase2(  );

    // 上のグラフ
  document.querySelector("#sliderp1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewp1').innerText = val;
    phase.setPhase(1, val);
    phase.graph();
  });

  document.querySelector("#sliderp2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewp2').innerText = val;
    phase.setPhase(2, val);
    phase.graph();
  });

  document.querySelector("#slidera1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewa1').innerText = val;
    phase.setAmp(1, val);
    phase.graph();
  });

  document.querySelector("#slidera2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewa2').innerText = val;
    phase.setAmp(2, val);
    phase.graph();
  });

  // 下のグラフ
  document.querySelector("#sliders1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#views1').innerText = val;
    phase2.setAmp(1, "sin", val);
    phase2.graph();
  });
  document.querySelector("#sliderc1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewc1').innerText = val;
    phase2.setAmp(1, "cos", val);
    phase2.graph();
  });
  document.querySelector("#sliders2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#views2').innerText = val;
    phase2.setAmp(2, "sin", val);
    phase2.graph();
  });
  document.querySelector("#sliderc2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewc2').innerText = val;
    phase2.setAmp(2, "cos", val);
    phase2.graph();
  });
  document.querySelector("#slidersc1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewsc1').innerText = val;
    let sin = Math.sin(val/180.0*Math.PI)/2.0;
    let cos = Math.cos(val/180.0*Math.PI)/2.0;
    phase2.setAmp(1, "sin", cos);
    phase2.setAmp(1, "cos", sin);
    document.querySelector("#sliders1").value = cos;
    document.querySelector("#sliderc1").value = sin;
    document.querySelector('#views1').innerText = Math.round(cos*100)/100;
    document.querySelector('#viewc1').innerText = Math.round(sin*100)/100;
    phase2.graph();
  });
  document.querySelector("#slidersc2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    document.querySelector('#viewsc2').innerText = val;
    let sin = Math.sin(val/180.0*Math.PI)/2.0;
    let cos = Math.cos(val/180.0*Math.PI)/2.0;
    phase2.setAmp(2, "sin", cos);
    phase2.setAmp(2, "cos", sin);
    document.querySelector("#sliders2").value = cos;
    document.querySelector("#sliderc2").value = sin;
    document.querySelector('#views2').innerText = Math.round(cos*100)/100;
    document.querySelector('#viewc2').innerText = Math.round(sin*100)/100;
    phase2.graph();
  });

  // 初期状態のグラフ描画
  phase.graph();
  phase2.graph();

});
