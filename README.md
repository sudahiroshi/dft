# DFT

ファイル構成
1. dft.html : 本体
1. WebkitPlayer.js : 音像化ライブラリ
1. vcanvas.js : 仮想座標対応描画ライブラリ

## dft.html

本体です．
以下のメソッドを持っています．
ただし，簡単化のためグローバル化それに近い変数に直接値を代入しています．

### waves( freq, amp, member, sec, isLoop)

基本周波数をベースとして，倍率と振幅を受け取り波形を合成するメソッド．合成した波形は配列dataに直接代入する．

|変数名|型|意味|
|:-|:-|:-|
|freq|整数|基本周波数|
|amp|整数|振幅|
|member|ハッシュ|周波数ごとの振幅．基本周波数に対する倍率をkey，振幅をvalueとする|
|sec|整数|秒数（通常は1）|
|isLoop|boolean|ループさせるか|

### dft()

配列dataに含まれている波形データをフーリエ変換して，配列data2に入れるメソッド．実際にフーリエ変換するデータ数はdftareaで与える．

### 使用例

```javascript
var samplerate = 44100; // サンプリングレート
var data;               // データを入れておく変数

// 440Hzを基本周波数とし，基本振幅0.5，周波数1で振幅0.5の波と周波数2で振幅0.5の波の合成，1秒分
waves( 440, 0.5, {1:0.5, 2:0.5}, 1 );
var player = new WebkitPlayer( samplerate, 1 );
// 配列data内の数列を音として鳴らす
player.playData( data, 1 );
```


本リポジトリで使用しているWebkitPlayerは，参考文献より拝借しました．

## 参考
[JavaScriptでリアルタイムに音を鳴らす方法を3つほど - つまみ食う](http://d.hatena.ne.jp/mohayonao/20110808/1312803835)
