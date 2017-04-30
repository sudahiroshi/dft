/**
 * @public
 * Canvas with virtual coordinate
 */
class VCanvas {

  /**
   * @param { HTMLCanvasElement } canvasElement HTMLのCanvas要素
   */
  constructor( canvasElement ) {
    /** @private */
    this._canvas = canvasElement;
    this._context = canvasElement.getContext("2d");
    this._scaleWidth = null;
    this._scaleHeight = null;
    this._scaleTop = null;
    this._slaceLeft = null;
    this._scalable = false;
    var _dir_x = 1; // X軸の向き
    var _dir_y = 1; // Y軸の向き
    var _color = [0,0,0,1]; // 色の初期値は黒
  };

  /**
   * 仮想座標を設定する．
   *
   * @param { number } left 左端の座標
   * @param { number } top 上端の座標
   * @param { number } width 仮想座標の幅
   * @param { number } height 仮想座標の高さ
   */
  scale( left, top, width, height ) {
    this._scaleLeft = left;
    this._scaleTop = top;
    this._scaleWidth = width;
    this._scaleHeight = height;
    this._scalable = true;

    if( this._scaleWidth < 0 ) {
      this._scaleWidth = -this._scaleWidth;
      this._dir_x = -1;
    } else this._dir_x = 1;

    if( this._scaleHeight < 0 ) {
      this._scaleHeight = -this._scaleHeight;
      this._dir_y = -1;
    } else this._dir_y = 1;
  };

  /**
   * 描画する際の色を設定する．
   * パラメータr,g,bはいずれも0〜255，aは0〜1．
   *
   * @param { number } r 赤
   * @param { number } g 緑
   * @param { number } b 青
   * @param { number } a 透明度
   */
  forecolor( r, g, b, a ) {
    var alpha = a;
    if( arguments.length == 3 ) alpha = 1
		this._color = [ r, g, b, alpha ];
		this._context.fillStyle = 'rgba(' + this._color.join(',').toString() + ')';
		this._context.strokeStyle = 'rgba(' + this._color.join(',').toString() + ')';
	}

  /**
   * 線の太さを設定する．
   * 単位はピクセル．
   *
   * @param { number } width 線の太さ
   */
  lineWidth( width ) {
		this._context.lineWidth = width;
	}

  /**
   * 線の太さを設定する．
   * lineWidthと同じ働き．
   *
   * @param { number} width 線の太さ
   */
	drawWidth( width ) {
		this._context.lineWidth = width;
	}

  /**
   * フォントを設定する．
   *
   * @param { string } font フォント情報
   */
  setFont( font ) {
		this._context.font = font;
	}

  /**
   * 線を描画する
   *
   * @param { number } x1 始点のX座標
   * @param { number } y1 始点のY座標
   * @param { number } x2 終点のX座標
   * @param { number } y2 終点のX座標
   */
  line( x1, y1, x2, y2 ) {
    if( this._scalable ) {
			var xx1 = (x1 - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var xx2 = (x2 - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var yy1 = (y1 - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
			var yy2 = (y2 - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		} else {
			var xx1 = x1;
			var xx2 = x2;
			var yy1 = y1;
			var yy2 = y2;
		}
		this._context.moveTo( xx1, yy1 );
		this._context.lineTo( xx2, yy2 );
  }

  /**
   * 連続的に線を描画する際の始点を設定する
   *
   * @param { number } x 始点のX座標
   * @param { number } y 始点のY座標
   */
  lineStart( x, y ) {
		if( this._scalable ) {
			var xx = (x - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var yy = (y - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		} else {
			var xx = x;
			var yy = y;
		}
		this._context.moveTo( xx, yy );
	}

  /**
   * 連続的に線を描画する．正確には直前に描画された座標から線を引く
   *
   * @param { number } x 終点のX座標
   * @param { number } y 終点のY座標
   */
	lineto( x, y ) {
		if( this._scalable ) {
			var xx = (x - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var yy = (y - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		} else {
			var xx = x;
			var yy = y;
		}

    this._context.lineTo( xx,yy );
    this._context.lineTo( xx,yy );
	}

  /**
   * 連続的に線を描画する．正確には直前に描画された座標から線を引く
   *
   * @param { number } x 終点のX座標
   * @param { number } y 終点のY座標
   */
	lineTo( x, y ) {
		if( this._scalable ) {
			var xx = (x - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var yy = (y - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		} else {
			var xx = x;
			var yy = y;
		}

    this._context.lineTo( xx,yy );
    this._context.lineTo( xx,yy );
	}

  /**
   * 描画開始時の宣言．最初にbeginPathを呼び，最後にstrokeかfillを呼ぶ
   */
  beginPath() {
    this._context.beginPath();
  }

  /**
   * 線描画
   */
  stroke() {
    this._context.stroke();
  }

  /**
   * 塗りつぶし描画
   */
  fill() {
    this._context.fill();
  }

  /**
   * 描画領域のクリア
   */
  cls() {
		this._context.beginPath();
		this._context.clearRect( 0, 0, this._canvas.width, this._canvas.height );
		this._context.fill();
	}

  /**
   * 点を描画する
   *
   * @param { number } x 点のX座標
   * @param { number } y 点のY座標
   */
  pset( x, y ) {
		if( this._scalable ) {
			var xx = (x - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var yy = (y - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		} else {
			var xx = x;
			var yy = y;
		}
		this._context.moveTo( xx, yy );
		this._context.lineTo( xx+1, yy+1 );
	}

  /**
   * 円を描画する
   *
   * @param { number } x 円の中心のX座標
   * @param { number } y 円の中心のY座標
   * @param { number } radius 円の半径
   */
  circle( x, y, radius ) {
		var xx = (x - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
		var yy = (y - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		this._context.moveTo( xx+radius, yy );
		this._context.arc( xx, yy, radius, 0, Math.PI*2, false);
	}

  /**
   * 長方形を描画する
   *
   * @param { number } x1 長方形の1つの頂点のX座標
   * @param { number } y1 同じ頂点のY座標
   * @param { number } x2 上記の頂点の対角の頂点のX座標
   * @param { number } y2 同じ頂点のY座標
   */
  rect( x1, y1, x2, y2 ) {
    // 長方形を描画
		var xx1 = (x1 - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
		var yy1 = (y1 - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		var xx2 = (x2 - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
		var yy2 = (y2 - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;

		this._context.fillRect( xx1, yy1, xx2-xx1, yy2-yy1 );
	}

  /**
   * 文字列を描画する
   *
   * @param { number } x 文字を描画するX座標
   * @param { number } y 文字を描画するY座標
   * @param { string } str 文字列
   */
  print( x, y, str ) {
		if( this._scalable ) {
			var xx = (x - this._scaleLeft) * this._canvas.width / this._scaleWidth * this._dir_x;
			var yy = (y - this._scaleTop) * this._canvas.height / this._scaleHeight * this._dir_y;
		} else {
			var xx = x;
			var yy = y;
		}
		this._context.fillText( str, xx, yy );
	}
}
