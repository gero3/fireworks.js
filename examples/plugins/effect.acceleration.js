/**
 * Shortcut to create Fireworks.EffectRandomDriftVelocity
*/
Fireworks.EffectsStackBuilder.prototype.acceleration	= function(opts)
{
	opts		= opts		|| {};
	var effectId	= opts.effectId	|| 'acceleration';
	console.assert( opts.shape instanceof Fireworks.Shape );
	// create the effect itself
	Fireworks.createEffect(effectId, {
		shape	: opts.shape
	}).onCreate(function(particle){
		particle.set('acceleration', {
			vector	: new Fireworks.Vector()
		});
	}).onBirth(function(particle){
		var acceleration= particle.get('acceleration').vector;
		this.opts.shape.randomPoint(acceleration)
	}).onUpdate(function(particle, deltaTime){
		var velocity	= particle.get('velocity').vector;
		var acceleration= particle.get('acceleration').vector;
		velocity.x	+= acceleration.x * deltaTime;
		velocity.y	+= acceleration.y * deltaTime;
		velocity.z	+= acceleration.z * deltaTime;
	}).pushTo(this._emitter);

	return this;	// for chained API
};
