var l=Object.defineProperty;var u=(a,t,s)=>t in a?l(a,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):a[t]=s;var e=(a,t,s)=>u(a,typeof t!="symbol"?t+"":t,s);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))h(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&h(c)}).observe(document,{childList:!0,subtree:!0});function s(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function h(i){if(i.ep)return;i.ep=!0;const r=s(i);fetch(i.href,r)}})();class w{constructor(t){e(this,"canvas");e(this,"context");e(this,"_pacman");e(this,"ghosts");e(this,"dots");e(this,"walls");e(this,"dotsEaten");this.canvas=document.getElementById(t),this.context=this.canvas.getContext("2d"),this._pacman=new f(this.canvas.width/2,this.canvas.height/2),this.ghosts=[new o(50,450),new o(50,100)],this.walls=this.createWalls(),this.dots=this.createDots(),this.dotsEaten=0}createWalls(){return[new n(0,0,this.canvas.width,20),new n(0,this.canvas.height-20,this.canvas.width,20),new n(0,0,20,this.canvas.height),new n(this.canvas.width-20,0,20,this.canvas.height),new n(100,100,300,20),new n(300,200,20,200)]}createDots(){let t=[];for(let s=0;s<this.canvas.width;s+=20)for(let h=0;h<this.canvas.height;h+=20){const i=new p(s,h);this.walls.some(r=>r.collidesWith(i))||t.push(i)}return t}start(){setInterval(()=>{this.update(),this.draw()},1e3/60)}update(){this._pacman.update(this.walls),this.ghosts.forEach(t=>t.update(this.walls)),this.dots=this.dots.filter(t=>this._pacman.collidesWith(t)?(this.dotsEaten++,!1):!0)}draw(){this.context.clearRect(0,0,this.canvas.width,this.canvas.height),this._pacman.draw(this.context),this.ghosts.forEach(t=>t.draw(this.context)),this.dots.forEach(t=>t.draw(this.context)),this.walls.forEach(t=>t.draw(this.context)),this.context.fillStyle="white",this.context.font="20px Arial",this.context.fillText(`Dots Eaten: ${this.dotsEaten}`,this.canvas.width-150,30)}get pacman(){return this._pacman}}class f{constructor(t,s){e(this,"x");e(this,"y");e(this,"radius");e(this,"speed");e(this,"direction");this.x=t,this.y=s,this.radius=10,this.speed=2,this.direction="right"}update(t){let s=this.x,h=this.y;switch(this.direction){case"right":s+=this.speed;break;case"left":s-=this.speed;break;case"up":h-=this.speed;break;case"down":h+=this.speed;break}t.some(i=>i.collidesWithCircle(s,h,this.radius))||(this.x=s,this.y=h)}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,.2*Math.PI,1.8*Math.PI),t.lineTo(this.x,this.y),t.fillStyle="yellow",t.fill(),t.closePath()}setDirection(t){this.direction=t}collidesWith(t){return Math.sqrt((this.x-t.x)**2+(this.y-t.y)**2)<this.radius+t.radius}}class o{constructor(t,s){e(this,"x");e(this,"y");e(this,"radius");e(this,"speed");e(this,"direction");e(this,"changeDirectionInterval");this.x=t,this.y=s,this.radius=10,this.speed=2,this.direction=this.getRandomDirection(),this.changeDirectionInterval=0}getRandomDirection(){const t=["right","left","up","down"];return t[Math.floor(Math.random()*t.length)]}update(t){let s=this.x,h=this.y;switch(this.direction){case"right":s+=this.speed;break;case"left":s-=this.speed;break;case"up":h-=this.speed;break;case"down":h+=this.speed;break}t.some(i=>i.collidesWithCircle(s,h,this.radius))?this.direction=this.getRandomDirection():(this.x=s,this.y=h),this.changeDirectionInterval++,this.changeDirectionInterval>60&&(this.direction=this.getRandomDirection(),this.changeDirectionInterval=0)}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.fillStyle="red",t.fill(),t.closePath()}}class p{constructor(t,s){e(this,"x");e(this,"y");e(this,"radius");this.x=t,this.y=s,this.radius=3}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.fillStyle="white",t.fill(),t.closePath()}}class n{constructor(t,s,h,i){e(this,"x");e(this,"y");e(this,"width");e(this,"height");this.x=t,this.y=s,this.width=h,this.height=i}draw(t){t.fillStyle="blue",t.fillRect(this.x,this.y,this.width,this.height)}collidesWith(t){return t.x>this.x&&t.x<this.x+this.width&&t.y>this.y&&t.y<this.y+this.height}collidesWithCircle(t,s,h){const i=Math.max(this.x,Math.min(t,this.x+this.width)),r=Math.max(this.y,Math.min(s,this.y+this.height)),c=t-i,d=s-r;return c**2+d**2<h**2}}window.onload=()=>{const a=new w("gameCanvas");a.start(),document.addEventListener("keydown",t=>{switch(t.key){case"ArrowRight":a.pacman.setDirection("right");break;case"ArrowLeft":a.pacman.setDirection("left");break;case"ArrowUp":a.pacman.setDirection("up");break;case"ArrowDown":a.pacman.setDirection("down");break}})};
