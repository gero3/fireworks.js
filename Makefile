# makefile to automatize simple operations

server:
	python -m SimpleHTTPServer

deploy:
	# assume there is something to commit
	# use "git diff --exit-code HEAD" to know if there is something to commit
	# so two lines: one if no commit, one if something to commit 
	git commit -a -m "New deploy" && git push -f origin HEAD:gh-pages && git reset HEAD~



buildCore:
	echo			 > build/fireworks.js
	cat src/core.js		>> build/fireworks.js
	cat src/emitter.js	>> build/fireworks.js
	cat src/spawner.js	>> build/fireworks.js
	cat src/particle.js	>> build/fireworks.js
	cat src/effect.js	>> build/fireworks.js

minifyCore:
	curl --data-urlencode "js_code@build/fireworks.js" 	\
		-d "output_format=text&output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile		\
		> build/fireworks.min.js
	@echo size minified + gzip is `gzip -c build/fireworks.min.js | wc -c` byte

buildBundle:
	echo			 > build/fireworks-bundle.js
	cat build/fireworks.js	>> build/fireworks-bundle.js
	cat src/plugins/*.js	>> build/fireworks-bundle.js

minifyBundle:
	curl --data-urlencode "js_code@build/fireworks-bundle.js" 	\
		-d "output_format=text&output_info=compiled_code&compilation_level=SIMPLE_OPTIMIZATIONS" \
		http://closure-compiler.appspot.com/compile		\
		> build/fireworks-bundle.min.js
	@echo size minified + gzip is `gzip -c build/fireworks-bundle.min.js | wc -c` byte

.PHONY: build minify