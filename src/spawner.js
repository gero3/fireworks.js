Fireworks.Spawner	= function(){
	this._isRunning	= false;
}

Fireworks.Spawner.prototype.start	= function(){
	this._isRunning	= true;
}

Fireworks.Spawner.prototype.stop	= function(){
	this._isRunning	= false;
}

Fireworks.Spawner.prototype.isRunning	= function(){
	return this._isRunning;
}
