"use strict";

class Wave {
  constructor() {
    this.sample_rate = 44100; // サンプリングレート
    this.data; // データを入れておく変数
    this.data2;
    this.area = 5; // 表示領域（全体の先頭5%を表示）
    this.skip = 2; // グラフ表示時の間引き数
    this.dft_area = 0.23; // DFTの演算・表示領域を先頭100サンプル程度に調整
  }

  synthesize(freq, amp, member, sec) {
    // 基本周波数と，含まれる周波数スペクトラムを受け取り，波形を合成するメソッド
    // freqは基本周波数
    // memberは周波数をkey，振幅をvalueとするハッシュテーブル
    // secは秒数
    this.data = new Array(this.sample_rate * sec);
    for (let i = 0; i < this.data.length; i++) this.data[i] = 0;
    for (let j in member) {
      let k = (2 * Math.PI * freq * j) / this.sample_rate;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] += member[j] * Math.sin(k * i);
      }
    }
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] *= amp;
    }
  }

  dft() {
    let calc_area = Math.ceil((this.data.length * this.dft_area) / 100); //データ数の計算．ceilは小数点以下を切り上げる
    this.data2 = new Array(calc_area);
    for (let n = 0; n < calc_area; n++) {
      let ar = 0.0;
      let ai = 0.0;
      for (let m = 0; m < calc_area; m++) {
        let x = ((2.0 * Math.PI) / calc_area) * m * n;
        ar += this.data[m] * Math.cos(-x);
        ai += this.data[m] * Math.sin(-x);
      }
      ar /= calc_area;
      ai /= calc_area;
      this.data2[n] = Math.sqrt(ar * ar + ai * ai);
    }
  }
}

window.addEventListener("load", () => {
  // 波形データを初期化
  var wave = new Wave();

  // サンプリング周波数44.1kHz，モノラルとして初期化する
  var player = new WebkitPlayer( wave.sample_rate, 1);

  // wave1が押された場合に440Hzのsin波を生成する
  document.getElementById("wave1").addEventListener("click", () => {
    wave.synthesize(
      440,
      1,
      { 1: 1 },
      1
    );
  });

  // wave2が押された場合に880Hzのsin波を生成する
  document.getElementById("wave2").addEventListener("click", () => {
    wave.synthesize(
        880,
        1,
        { 1: 1 },
        1
      );
  });

  // wave3が押された場合に440Hzと880Hzのsin波を合成する
  document.getElementById("wave3").addEventListener("click", () => {
    wave.synthesize(
        440,
        0.5,
        { 1: 1, 2: 1 },
        1
        );
  });

  // 矩形波を合成する
  document.getElementById("wave4").addEventListener("click", () => {
    wave.synthesize(
      440,
      0.8,
      { 1: 1, 3: 1 / 3.0, 5: 1 / 5.0, 7: 1 / 7.0, 9: 1 / 9.0 },
      1
    );
  });

  // ノコギリ波を合成する
  document.getElementById("wave5").addEventListener("click", () => {
    wave.synthesize(
      440,
      0.3,
      { 1: 2, 2: -1, 3: 2 / 3, 4: -1 / 2, 5: 2 / 5, 6: -1 / 3 },
      1
    );
  });

  document.getElementById("graph").addEventListener("click", () => {
    // 仮想座標対応Canvasの初期化
    var vc1 = new VCanvas(document.getElementById("canvas1"));
    vc1.forecolor(0, 0, 0);
    var plotnumber = (wave.data.length * wave.area) / 100;
    vc1.cls(); // 描画内容の消去

    // X軸とY軸の描画
    vc1.scale(0, 1, plotnumber, -2);
    vc1.beginPath(); // 描画開始の宣言
    vc1.line(0, 0, wave.data.length, 0);
    vc1.line(0, -1, 0, 1);
    for (var i = 0; i < plotnumber; i += wave.skip * 100) {
      vc1.print(i, 0, i);
    }
    vc1.stroke(); // 描画

    // dataの内容の描画
    vc1.beginPath(); // 描画開始の宣言
    vc1.lineStart(0, 0); // 始点の設定
    for (var i = 0; i < plotnumber; i += wave.skip) {
      vc1.lineto(i, wave.data[i]);
    }
    vc1.stroke(); // 描画
  });

  document.getElementById("sound").addEventListener("click", () => {
    player.playData(wave.data, 1);
  });

  document.getElementById("dft").addEventListener("click", () => {
    wave.dft();
    // 仮想座標対応Canvasの初期化
    var vc2 = new VCanvas(document.getElementById("canvas2"));
    vc2.forecolor(0, 0, 0);
    vc2.cls(); // 描画内容の消去

    // X軸とY軸の描画
    vc2.scale(0, 1, wave.data2.length, -2);
    vc2.beginPath(); // 描画開始の宣言
    vc2.line(0, 0, wave.data2.length, 0);
    vc2.line(0, -1, 0, 1);
    for (var i = 0; i < wave.data2.length; i += wave.skip * 100) {
      vc2.print(i, 0, i);
    }
    vc2.stroke(); // 描画

    // dataの内容の描画
    vc2.beginPath(); // 描画開始の宣言
    for (var i = 1; i < wave.data2.length; i++) {
      vc2.rect(i, 0, i + 1, wave.data2[i]); // DFTのグラフ描画
      //console.log( i + ":" + data2[i] );          // 演算結果をコンソールに表示
    }
    vc2.stroke(); // 描画
    console.log(wave.data2.length);
  });

  document.getElementById("sound").addEventListener("click", () => {
    player.playData(wave.data, 1);
  });
});
