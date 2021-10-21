#!/bin/sh

npm run build \
&& rm -rf gvfl \
&& mkdir gvfl \
&& cp -r `ls -A | grep -v 'node_modules\|.git\|gvfl\|.env'` gvfl \
&& rm -rf gvfl.zip \
&& tar -cvzf gvfl.zip gvfl \
&& rm -rf gvfl \
&& echo 'Zip successful.'
