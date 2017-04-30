(function(window, undefined) {

  function WebkitPlayer( samplerate, channel ) {
    // コンストラクタに相当するメソッド
    // samplerateはサンプリング周波数
    // channelはチャンネル数（モノラルなら1,ステレオなら2）
    this.rate = samplerate;
    this.chan = channel;

    this.context = new AudioContext();
    this.buf = null;
    this.dest = this.context.destination;
    this.src = null;
  };

  WebkitPlayer.prototype.playData = function(inputData, times, isLoop) {
    // 配列を受け取って音として再生するメソッド
    // inputDataは鳴らしたいデータ列の配列
    // timesは繰り返し回数
    // isLoopはループ再生するかどうか（trueならループ，それ以外なら1回のみ）
    this.buf = this.context.createBuffer(this.chan, inputData.length*times, this.rate);
  	var data = this.buf.getChannelData( 0 );
    var pt = 0;
    for( var j=0; j<times; j++ ) {
      for( var i=0; i<inputData.length; i++ ) {
        data[pt] = inputData[i];
        pt++;
      }
    }

  	this.src = this.context.createBufferSource();
    this.src.buffer = this.buf;
    this.src.connect( this.dest );
    if( arguments.length == 3)	this.src.loop = isLoop;
    else	this.loop = false;
    this.src.start();
  };

  WebkitPlayer.prototype.playWaves = function(freq, member, sec, isLoop) {
    // 基本周波数と，含まれる周波数スペクトラムを受け取り，合成して鳴らすメソッド
    // freqは基本周波数
    // memberは周波数をkey，振幅をvalueとするハッシュテーブル
    // secは鳴らす秒数
    // isLoopはループ再生するかどうか（trueならループ，それ以外なら1回のみ）
    this.buf = this.context.createBuffer(this.chan, this.rate*sec, this.rate);
  	var data = this.buf.getChannelData( 0 );
  	for( var i=0; i<data.length; i++ )	data[i] = 0;
  	for( j in member ) {
  		var k = 2 * Math.PI * freq * j / this.rate;
  		for(var i=0; i<data.length; i++){
  			data[i] += member[j] * Math.sin(k * i);
  		}
  	}
  	this.src = this.context.createBufferSource();
    this.src.buffer = this.buf;
    this.src.connect( this.dest );
    if( arguments.length == 4)	this.src.loop = isLoop;
    else	this.loop = false;
    this.src.start();
  };

  window.WebkitPlayer = WebkitPlayer;
})(window);
