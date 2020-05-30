"use strict";

class Phase {
  constructor() {
    this.data = {
      freq: 440,
      amp: 0.5,
      member: { 1: 0.5, 2: 0.5 },
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
window.addEventListener("load", () => {
  // 波形データを初期化
  let phase = new Phase();

  // サンプリング周波数44.1kHz，モノラルとして初期化する
//  let player = new WebkitPlayer(wave.sample_rate, 1);

  // wave3が押された場合に440Hzと880Hzのsin波を合成する

  document.querySelector("#sliderp1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    phase.setPhase(1, val);
    phase.graph();
  });

  document.querySelector("#sliderp2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    phase.setPhase(2, val);
    phase.graph();
  });

  document.querySelector("#slidera1").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    phase.setAmp(1, val);
    phase.graph();
  });

  document.querySelector("#slidera2").addEventListener("input", (ev) => {
    let val = ev.srcElement.value;
    phase.setAmp(2, val);
    phase.graph();
  });
  phase.graph();
//   document.getElementById("sound").addEventListener("click", () => {
//     player.playData(wave.data, 1);
//   });
});