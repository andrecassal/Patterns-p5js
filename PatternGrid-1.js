class Grid{
	constructor(amt){
		amt = amt || 20;
		this.w = width;
		this.h = height;
		this.blkW = this.w / amt;
		this.blkH = this.h / amt;
		this.grid = [];
		this.types = [
									Triangles,
									Dots,
									Donut,
									Circle,
									CornerCircle,
									CornerRect,
									Stairs,
									Cross,
									HalfCircles,
									Stripes,
									CorneredSquares,
									]
	}
	build(){
		for( let x=0;x<this.w;x+=this.blkW){
			for( let y=0;y<this.w;y+=this.blkH){
				let b;
				switch(floor(random(this.types.length-1))){
					case 9:		b	=	new Triangles(x,y,this.blkW,this.blkH); break;
					case 8:		b	=	new Dots(x,y,this.blkW,this.blkH); break;
					case 7:		b	=	new Donut(x,y,this.blkW,this.blkH); break;
					case 6:		b	=	new Circle(x,y,this.blkW,this.blkH); break;
					case 5:		b	=	new CornerCircle(x,y,this.blkW,this.blkH); break;
					case 4:		b	=	new CornerRect(x,y,this.blkW,this.blkH); break;
					case 3:		b	=	new Stairs(x,y,this.blkW,this.blkH); break;
					case 2:		b	=	new Cross(x,y,this.blkW,this.blkH); break;
					case 1:		b	=	new HalfCircles(x,y,this.blkW,this.blkH); break;
					case 0: 	b = new Stripes(x,y,this.blkW,this.blkH); break;
					default: 	b = new CorneredSquares(x,y,this.blkW,this.blkH);
					// default: b = new Stairs(x,y,this.blkW,this.blkH);
				}
				this.grid.push(b)
			}
		}
	}
	update(){}
	render(){
		for(let c of this.grid){
			c.update();
			c.render();
		}
	}	
}

class Animation{
	static easeInSine(x){
  	return 1 - cos((x * PI) / 2);
	}
}

class Block{
	constructor(x,y,w,h){
		this.x = x;
		this.y = y;
		this.w = w || 100;
		this.w2 = this.w/2;
		this.h = h || w;
		this.h2 = this.h/2;
		this.i = 0;
		this.colors = [];
		this.randoms = [];
		this.rotation = [];
	}
	getColor(pii){
		if(!this.colors[pii]){
			this.colors[pii] = random( colors );
		}
		return this.colors[pii]
	}
	getRotate(pii){
		if(!this.rotation[pii]){
			this.rotation[pii] = random([0,QUARTER_PI,HALF_PI,PI]);
		}
		return this.rotation[pii];
	}
	update(){
		// let a = map(frameCount,0,60*2,0,1)
		// this.i = Animation.easeInSine(a);
	}
	map(min,max){
		return map(this.i,0,1,min,max);
	}
	random(pii){
		if(!this.randoms[pii]){
			this.randoms[pii] = random();
		}
		return this.randoms[pii];
	}
	render(){}
}


class Cross extends Block{
	render(){

		let blk = (this.w+this.h) / 8;
		let rot = 0;

		push();
		translate(this.x,this.y);
		fill( this.getColor(0) );
		rect(0,0, this.w, this.h);

		fill( this.getColor(1) );
		translate(this.w2,this.h2);
		rectMode(CENTER);
		if(this.random(1)>0.2){
			rot += QUARTER_PI;	
		}
		rotate(this.map(0,PI))
		rect(0,0, this.w-blk, blk);
		rect(0,0, blk, this.w-blk);

		pop();
	}
}

class CorneredSquares extends Block{
	render(){
		push();
		translate(this.x,this.y);
		fill( this.getColor(0) );
		rect(0,0, this.w, this.h);
		let x=y=0,r=this.random(0);
		if(r>.75){
				x = w;
				y = h;
		}else if(r>.5){
				x = w;
				y = 0;
		}else{
				x = 0;
				y = h;
		}
		fill( this.getColor(1) );
		rect(x*.3,y*.3, this.w*.7, this.h*.7);
		fill( this.getColor(2) );
		rect(x*.6,y*.6, this.w*.4, this.h*.4);
		pop();		
	}
}

class Stripes extends Block{
	render(){
		let m = 5;
		let b = this.h/m;
		push();
		translate(this.x,this.y);
		fill(this.getColor(0));
		rect(0,0,this.w,this.h);
		if( this.random(1)>.5 ){
			translate(0,this.h)
			rotate(-HALF_PI)
		}
		
		for(let i=0;i<m;i++){
			fill( i % 2 ? this.getColor(1) : this.getColor(2) )
			rect(0,i*b, map(this.i,0,2,0,this.w), b);	
		}	
		pop();
	}
}

class HalfCircles extends Block{
	render(){
		push();
		translate(this.x,this.y);
		fill( this.getColor(0) );
		rect(0,0, this.w, this.h);
		translate(this.w2,this.h2)
		if(this.random(0)>.4){
			rotate(HALF_PI)
		}
		fill( this.getColor(1) );
		arc(this.w2,0, this.w, this.h, HALF_PI, -HALF_PI)
		fill( this.getColor(2) );
		arc(-this.w2,0, this.w, this.h, -HALF_PI, HALF_PI)
		pop();
	}
}

class Stairs extends Block{
	update(){};
	render(){
		push();
		translate(this.x,this.y);
		fill( this.getColor(0) );
		rect(0,0, this.w, this.h);
		if(this.random(0)>0.7){
			translate(this.w,0)
			scale(-1,1)
		}
		fill( this.getColor(1) );
		let blcW = this.w*0.2;
		let blcH = this.h*0.2;
		beginShape();
		vertex(0,0);
		for(let a=1;a<6;a++){
			vertex(	(blcW*a), (blcH*(a-1)));
			vertex(	(blcW*a), (blcH*a));
		}
		vertex(0,this.h);
		endShape();
		pop();
	}
}

class CornerRect extends Block{
	render(){
	
	let x = this.x,
			y = this.y,
			w = this.w,
			h = this.h,
			w2 = this.w2,
			h2 = this.h2;
	
	push();
	translate(x,y);
	fill( this.getColor() );
	triangle(0,0,w,0,w2,h2);
	fill( this.getColor() );
	triangle(w,0,w,h,w2,h2);
	fill( this.getColor() );
	triangle(0,h,w2,h2,w,h);
	fill( this.getColor() );
	triangle(0,0,w2,h2,0,h);
	
	translate(w2,h2)
	rotate(-HALF_PI-QUARTER_PI);
	fill( this.getColor() );
	rect(0,0,w/4,h/4);	
	
	rotate(-HALF_PI);
	fill( this.getColor() );
	rect(0,0,w/4,h/4);	
	
	rotate(-HALF_PI);
	fill( this.getColor() );
	rect(0,0,w/4,h/4);	
	
	rotate(-HALF_PI);
	fill( this.getColor() );
	rect(0,0,w/4,h/4);	
	pop();
	}
}

class CornerCircle extends Block{
	render(){
	
	let x = this.x,
			y = this.y,
			w = this.w,
			h = this.h,
			w2 = this.w2,
			h2 = this.h2;
	let a2 = w/1.35;
	push();
	translate(x,y);

	fill( this.getColor() );
	triangle(0,0,w,0,w2,h2);
	fill( this.getColor() );
	triangle(w,0,w,h,w2,h2);
	fill( this.getColor() );
	triangle(0,h,w2,h2,w,h);
	fill( this.getColor() );
	triangle(0,0,w2,h2,0,h);
	
	fill( this.getColor() );
	arc(0,0,a2,a2,0											,QUARTER_PI,PIE)
	fill( this.getColor() );
	arc(0,0,a2,a2,QUARTER_PI						,HALF_PI,PIE)
	
	fill( this.getColor() );
	arc(w,0,a2,a2,PI-QUARTER_PI					,PI,PIE)
	fill( this.getColor() );
	arc(w,0,a2,a2,HALF_PI								,PI-QUARTER_PI,PIE)

	fill( this.getColor() );
	arc(w,h,a2,a2,PI+QUARTER_PI					,PI+HALF_PI,PIE)
	fill( this.getColor() );
	arc(w,h,a2,a2,PI										,PI+QUARTER_PI,PIE)
	
	fill( this.getColor() );
	arc(0,h,a2,a2,-QUARTER_PI						,0,PIE)
	fill( this.getColor() );
	arc(0,h,a2,a2,-HALF_PI							,-QUARTER_PI,PIE)

	pop();
	}
}

class Circle extends Block{
	render(){

		let a2 = this.w/1.5;
		push();
		translate(this.x,this.y);

		fill( this.getColor(1) );
		triangle(0,0,this.w,0,this.w2,this.h2);
		fill( this.getColor(2) );
		triangle(this.w,0,this.w,this.h,this.w2,this.h2);
		fill( this.getColor(3) );
		triangle(0,this.h,this.w2,this.h2,this.w,this.h);
		fill( this.getColor(4) );
		triangle(0,0,this.w2,this.h2,0,this.h);

		if(this.random(1)<0.7){
			translate(this.w2,this.h2)
			rotate( map(this.i,0,1,0,QUARTER_PI) )
			fill( this.getColor(5) );
			arc(0,0,a2,a2,PI+QUARTER_PI				,-QUARTER_PI,PIE)
			fill( this.getColor(6) );
			arc(0,0,a2,a2,TWO_PI-QUARTER_PI		,QUARTER_PI,PIE)
			fill( this.getColor(7) );
			arc(0,0,a2,a2,QUARTER_PI					,PI-QUARTER_PI,PIE)
			fill( this.getColor(8) );
			arc(0,0,a2,a2,PI-QUARTER_PI				,PI+QUARTER_PI,PIE)
		}
		pop();

	}
}

class Wave extends Block{
	render(){
	
	let x = this.x,
			y = this.y,
			w = this.w,
			h = this.h,
			w2 = this.w2,
			h2 = this.h2;

		let waves = 2 * 2;
		let waveScaleX = w/3;
		let waveScaleY = 20;
		let waveMargin = 3;

		var c = createGraphics(w,h);

		c.stroke(0)
		c.strokeWeight(2);
		c.rect(0,0,w,h);
		c.triangle(0,0,w,0,w,h)

		// noFill();
		push();
		c.fill( getColor() );
		c.rotate(QUARTER_PI)
		c.beginShape();
		c.curveVertex(-waveScaleX,0)
		c.curveVertex(0,0)
		for(var i=1;i<waves;i++){
			c.curveVertex(i*waveScaleX, i%2==0 ? waveMargin : waveScaleY)
		}
		c.curveVertex(waves*waveScaleX,0)
		c.curveVertex((waves+1)*waveScaleX,0)
		c.endShape();
		pop();
		image(c,x,y);
	}
}

class Triangles extends Block{
	render(){
	
	let x = this.x,
			y = this.y,
			w = this.w,
			h = this.h,
			w2 = this.w2,
			h2 = this.h2;
	push()
	translate(x,y)
	//top left
	fill( this.getColor() );
	triangle(0,0, w2, h2, 0,h2)
	fill( this.getColor() );
	triangle(0,0, w2, 0, w2,h2)
	//top right
	fill( this.getColor() );
	triangle(w2,0, w, 0, w2,h2)
	fill( this.getColor() );
	triangle(w,0, w, h2, w2,h2)
	//bottom right
	fill( this.getColor() );
	triangle(w2,h2, w, h2, w,h)
	fill( this.getColor() );
	triangle(w2,h2, w, h, w2,h)
	//bottom left
	fill( this.getColor() );
	triangle(0,h2, w2, h2, 0,h)
	fill( this.getColor() );
	triangle(w2,h2, w2, h, 0,h)
	pop();
}
}

class Dots extends Block{
	render(){
		let amt = 3;
		let dot = (this.w + this.h / (amt * 2)) * 0.15;
		let dotw = this.w/amt;
		let doth = this.h/amt;
		push();
		translate(this.x,this.y)
		fill( this.getColor(1) );
		rect(0,0,this.w,this.h);
		translate(dotw/2,doth/2);
		fill( this.getColor(2) );
		let i = 1//this.i/2;
		for(var cx=0;cx<amt;cx++){
			for(var cy=0;cy<amt;cy++){
				circle(cx*dotw*i,cy*doth*i, dot); 
			}
		}
		pop();
	}
}

class Donut extends Block{
	render(){
			let r = PI/3; 
			push();
			translate(this.x,this.y)
			fill( this.getColor(1) );
			rect(0,0,this.w,this.h);

			translate(this.w/2,this.h/2);
			rotate( map(this.i,0,1,0,TWO_PI) )
			rotate( this.getRotate(1) )
			scale(0.75);
			fill( this.getColor(2) );
			arc(0, 0, this.w, this.h, PI, 0, CHORD) //top
			fill( this.getColor(3) );
			arc(0, 0, this.w, this.h, 0, PI, CHORD) //bottom

			rotate( this.getRotate(2) )
			fill( this.getColor(4) );
			arc(0, 0, this.w/2, this.h/2, PI, 0, CHORD) //top
			fill( this.getColor(5) );
			arc(0, 0, this.w/2, this.h/2, 0, PI, CHORD) //bottom
			pop();
	}
}

