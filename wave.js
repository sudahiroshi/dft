"use strict";

class Wave {
  constructor() {
    this.sample_rate = 44100; // サンプリングレート
    this.data; // データを入れておく変数
    this.data2;
    this.area = 2; // 表示領域（全体の先頭5%を表示）
    this.skip = 2; // グラフ表示時の間引き数
    this.dft_area = 0.23; // DFTの演算・表示領域を先頭100サンプル程度に調整
  }

  synthesize(freq, amp, member, sec, phase) {
    // 基本周波数と，含まれる周波数スペクトラムを受け取り，波形を合成するメソッド
    // freqは基本周波数
    // memberは周波数をkey，振幅をvalueとするハッシュテーブル
    // secは秒数
    // phaseは周波数をkey, 位相をvalueとするハッシュテーブル
    this.data = new Array(this.sample_rate * sec);
    for (let i = 0; i < this.data.length; i++) this.data[i] = 0;
    for (let j in member) {
      let k = (2 * Math.PI * freq * j) / this.sample_rate;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] += member[j] * Math.sin(k * i + phase[j]);
      }
    }
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] *= amp;
    }
  }
  synthesize2(freq, amp, member, sec) {
    // 基本周波数と，含まれる周波数スペクトラムを受け取り，波形を合成するメソッド
    // freqは基本周波数
    // memberは周波数をkey，振幅をvalueとするハッシュテーブル
    // secは秒数
    this.data = new Array(this.sample_rate * sec);
    for (let i = 0; i < this.data.length; i++) this.data[i] = 0;
    for (let j in member) {
      let k = (2 * Math.PI * freq * j) / this.sample_rate;
      for (let i = 0; i < this.data.length; i++) {
        this.data[i] +=
          member[j]["sin"] * Math.sin(k * i) +
          member[j]["cos"] * Math.cos(k * i);
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
