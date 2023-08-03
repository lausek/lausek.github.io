---
layout: post
tags: programming
---

Python brought me to neat range expressions like `0 < x < 1` that you can just read from lowest to highest.
For me, this aligns better with the English reading flow - left to right - and I would say that understanding complex expressions gets easier as well.
You don't have to do any mental context switching between "right is greater" or "right is less".

For said reason, I've almost entirely dropped usage of `>` and strictly use `<` ever since.
Instead of

``` python
if value > -100 and value < 100:
    ...
```

I would go with code that looks more like this

``` python
if -100 < value and value < 100:
    ...
```
