# tamerny
a text-based platform that optimizes on-demand services

Mac Download/Compile instructions:
1. Download meteor on your computer
2. Download ngrok
3. Clone ajamjoom/tamerny to your computer
4. cd to the tamerny dir from your terminal and input 'meteor'
  - If the code compiles and runs then all is set
  - If you get with Moyasar and babel-runtime do the following from your terminal:
    1. meteor install --save moyasar
    2. meteor install --save babel-runtime

= Code should work!

Windows Download/Compile instructions:
1. Download meteor on your computer
2. Download ngrok
3. Clone ajamjoom/tamerny to your computer
4. cd to the tamerny dir from your terminal and input 'meteor'
  - If the code compiles and runs then all is set
  - If you get a probem with materialize refer to https://github.com/Dogfalo/materialize/issues/4193 for the solution. 
    -> Solution that worked for me = literally just update materialize... go to tamerny/.meteor/packages and just delete the line that says materialize:materialize then compile you code and then go back and add it and compile again = should work
  - If you get a Moyasar and a babel-runtime error do the following from your terminal:
    1. meteor install --save moyasar
    2. meteor install --save babel-runtime

= Code should work!






