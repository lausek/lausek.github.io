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

<button id="trigger">Next one!</button>

<blockquote id="output">&lt;adjective&gt; &lt;daemon&gt; must/should/have to &lt;action&gt; because &lt;reason&gt;</blockquote>

###### *Nothing in this textbox represents my opinion. Not even the slightest.*

<script src="{{ site.url }}/js/phrases.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.phrases("trigger", "output");
    });
</script>
