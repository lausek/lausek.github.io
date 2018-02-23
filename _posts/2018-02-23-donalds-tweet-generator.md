---
layout: post
---

<style>
   #output {
    padding: 15px;
    font-weight: bold;
   }
   #trigger {
    padding: 10px;
   }
</style>

If you want to annoy people online but you have nothing relevant to say, just use the button below. Those phrases should perfectly annoy any thinking person on this planet.

<blockquote id="output">We need the wall!</blockquote>

<button id="trigger">Next one!</button>

###### *Nothing in this textbox represents my opinion. Not even the slightest.*

<script src="{{ site.url }}/js/phrases.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.phrases("trigger", "output");
    });
</script>
