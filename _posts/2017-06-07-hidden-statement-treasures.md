---
layout: post
---

Have you already experienced this one moment when you discover a feature inside abap docs, you have never ever seen? The feelings will be even better if it provides a standard solution to a problem you are facing quite often. In this post, I want to share some of my favorites.

### Tables to string

`CONCATENATE` is rusty, but offers the possibility to merge table lines into one string. Whenever I had this task, I implemented my solution in this way:

{% highlight abap %}
" For testing...
DATA(li_params) = VALUE string_table(
  ( `p=1` ) ( `s=up` ) ( `q=%23test` ) ( `p=a0s7ras213d23o4ij87` )
).

DATA(lw_joined) = REDUCE string(
  INIT s = ``
  FOR <x> IN li_params
  NEXT s = s &amp;&amp; <x>
).
{% endhighlight %}

To my luck, I recently had a look at the documentation which exposed two additional words for this command:

{% highlight abap %}
CONCATENATE LINES OF li_params INTO DATA(lw_joined).
" => p=1s=upq=%23testp=a0s7ras213d23o4ij87
{% endhighlight %}

Even better: The `SEPARATED BY` addition will insert a string between and **only between** lines. Fits perfectly whenever you want to join GET parameters. My generic snippet would have required checks on `sy-tabix` - horrible.

{% highlight abap %}
CONCATENATE LINES OF li_params INTO DATA(lw_joined) SEPARATED BY '&amp;'.
" => p=1&amp;s=up&amp;q=%23test&amp;p=a0s7ras213d23o4ij87 
{% endhighlight %}

Still, this approach is overly verbose compared to Pythons `'&amp;'.join(params)` but comparing expressiveness with ABAP in general is very unfair. ;-)

### Moving tables correspondingly

While inspecting the `CORRESPONDING` operator, I also noticed that tables could be moved with it. A sidenote brought me back to `MOVE-CORRESPONDING`. Apparently this has been possible for a long time. Just append `KEEPING TARGET LINES` to your statement and **BOOM**.

{% highlight abap %}
DATA li_knb1 TYPE STANDARD TABLE OF knb1 WITH EMPTY KEY.

" Fetch some data...
SELECT *
  FROM kna1
  INTO TABLE @DATA(li_kna1)
  UP TO 10 ROWS.

" Do some work and move to li_knb1

li_knb1 = CORRESPONDING #( li_kna1 ).

" ... is equivalent to ...

MOVE-CORRESPONDING li_kna1 TO li_knb1 KEEPING TARGET LINES.
{% endhighlight %}

Even tough, I highly suggest using the operator style just because it offers explicit mappings.

### Conclusion... for now

ABAP compensates a missing standard library with additional keywords. Is this a good thing? I don't think so. But it's better than not having a predefined solution.
I know there are a lot more functions, that come in handy. If you have some too - don't hesitate texting me via email.
