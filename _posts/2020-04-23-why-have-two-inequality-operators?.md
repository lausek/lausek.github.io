---
layout: post
tags: programming
---

Python brought me to neat range expressions like `0 < x < 1` that you can just read from lowest to highest. For me, this aligns better with the reading flow - left to right - and I tend to say that understanding a comparison gets easier therefore. This is due to what I would describe as a context switch inside your head i.e. flipping between "right is greater" or "right is less".

So some years ago, I've started to drop usage of `> (greater than)` and strictly used `less than` ever since. Instead of:

``` python
if value > -100 and value < 100:
    ...
```

I would go with code that is more like this:

``` python
if -100 < value and value < 100:
    ...
```

Of course, all of the above is my opinion but I would like to hear your thoughts about this. Are there any cases in which we **need** both operators? Is this actually common sense and nobody educates newcomers about it?
