/*
Copyright (c) 2015, Havel Cyrus

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var natural = require('natural');
var matrix = require('node-matrix');
var pagerank = require('pagerank-js');

module.exports = function() {
  this.splitToParagraphs = function(content) {
    return content.split('\n\n');
  };
  this.splitToSentences = function(content) {
    return content.match(/[^\.!\?]+[\.!\?]+/g);
  };
  this.splitToWords = function(content) {
    var tokenizer = new natural.WordTokenizer();
    return tokenizer.tokenize(content);
  };
  this.getSimilarityGraph = function(sentences) {
    var graph = new Array();
    for(s in sentences) {
      var sentenceSimilarity = new Array();
      for(t in sentences) {
        sentenceSimilarity.push(natural.LevenshteinDistance(sentences[s], sentences[t]));
      }
      graph.push(sentenceSimilarity);
    }
    return graph;
  };
  this.getTextRank = function(graph) {
    return pagerank(graph, 0.85, 0.0001, function (err, res) {
      if (err) throw new Error(err)
    });
  };
  this.getSelectedIndex = function(textRank, max) {
    var sortedIndex = new Array();
    var selectedIndex = new Array();
    var sortedRank = textRank.sort();
    for(var i = 1; i <= max; i++) {
      sortedIndex.push(sortedRank[sortedRank.length - i]);
    }
    for(var i = 0; i < max; i++) {
      for(var j = 0; j < textRank.length; j++) {
        if(sortedIndex[i] == textRank[j]) {
          var duplicate = false;
          if(selectedIndex.length > 0) {
            for(k in selectedIndex) {
              if(selectedIndex[k] == j) {
                duplicate = true;
                break;
              }
            }
            if(!duplicate) selectedIndex.push(j);
            else continue;
          } else {
            selectedIndex.push(j);
          }
          break;
        }
      }
    }
    return selectedIndex;
  }
  this.summarize = function(content, max) {
    var sentences = this.splitToSentences(content);
    var similarityGraph = this.getSimilarityGraph(sentences);
    var textRank = this.getTextRank(similarityGraph).probabilityNodes;
    var selectedIndex = this.getSelectedIndex(textRank, max);
    var result = '';
    for(i in selectedIndex)
      for(s in sentences)
        if(selectedIndex[i] == s) {
          result += sentences[s] + ' ';
        }
    return result;
  };
};
