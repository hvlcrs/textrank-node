# textrank-node
Textrank-node is an implementation of [text rank algorithm](http://web.eecs.umich.edu/~mihalcea/papers/mihalcea.emnlp04.pdf) 
written in Node JS.
You can simply add this module to your project and start right away using Node JS.

This code relies a lot on [natural](https://github.com/NaturalNode/natural) 
(which is an awesome library) for processing NLP related stuff.

Installation
------------

If you're just looking to use textrank-node without your own node application,
you can install via NPM like so:

    npm install textrank-node

If you're interested in contributing to textrank-node just fork it away.

Summarize
------------

As of this version, there is only one implementation of summarization, which you can use it like below:

    var textrank = require('textrank-node');
    var summarizer = new textrank();
    summarizer.summarize('some document here', 4);


The code above will make 4 sentences summary from a document or collection of string.
