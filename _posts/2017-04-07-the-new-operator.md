---
layout: post
---

Object oriented programming always felt weird in ABAP. Too many keywords for too little things. Some improvements against verbosity, especially [inline declarations](/2017/03/13/inline-declarations.html) and shortcut operators, help developers keep their view on the important logic-part instead of the annoying writing work. Switching to Eclipse is also a good plan if you have a lot of OOP to do. Coming to terms...

The natural way of instantiating a class would require a declaration in first place - often immediately followed by the creation call. Let's pretend our class `lcl_friend` has one constructor parameter called `name`. We now want to get ourself a new fam. Because implicit `EXPORTING` arguments are not supported by `CREATE OBJECT`, we need to blow up our construction a bit more:

{% highlight abap %}
DATA o_my_dude TYPE REF TO lcl_friend.

CREATE OBJECT o_my_dude
    EXPORTING
        name = `Daniel`.
{% endhighlight %}

Saying we don't have our dude reference declared yet, `NEW` requires the type for our `DATA` token. In this case the short way would be:

{% highlight abap %}
DATA(o_my_dude) = NEW lcl_friend( `Daniel` ).
{% endhighlight %}

### Not only for classes

We could create a reference for every type as long as it isn't generic like `data`, `p` or `c`. A common case I personally face quite often, is creating data based on certain conditions and afterwards working with it. You could either solve it with redundant code or just do it generically.

{% highlight abap %}
DATA o_vary TYPE REF TO data. " declare as REF TO data first

o_vary = NEW t_kna1( ).
" ...
o_vary = NEW t_knb1( ).
{% endhighlight %}

Okay, this is a very useless example as you can't work with `o_vary` without assigning it to a field-symbol, but I think you get the point of it. Maybe even more useless is this:

{% highlight abap %}
DATA(o_starting) = NEW i( 1 ).
DATA(o_kill_me) = NEW f( ).
{% endhighlight %}

I don't know. Maybe it helps you in some cases.

### Implicit creation

What if `o_my_dude` is already known to our compiler 'cause declaring `DATA` at the top of your local scope is still a good practice? That eases things up even more - at least the instantiation side.

{% highlight abap %}
DATA o_my_dude TYPE REF TO lcl_friend.
" ... banana banana banana
o_my_dude = NEW #( `Daniel` ).
{% endhighlight %}

You can think of the `#` sort of like a wildcard. We already typed our variable, so the friendly, little compiler could dig deep and find it out by himself.

### What about multiple arguments?

Sadly there nearly isn't a case where one parameter is enough. We can simulate another one by giving our friend a greeting formula:

{% highlight abap %}
" ...
METHODS
    constructor
        IMPORTING
            name        TYPE string
            greet_with  TYPE string DEFAULT `Hello`,
{% endhighlight %}

And like we would normally do it - specify them named:

{% highlight abap %}
DATA(o_my_dude) = NEW lcl_friend(
    name = `Daniel`
    greet_with = `Jaaaa Moooooooin`
).

WRITE o_my_dude->say_hello( ).
" => Jaaaa Moooooooin, my name is Daniel
{% endhighlight %}

Apparently Daniel thinks it is cool to talk in english but greet in german...

{% highlight abap %}
FREE o_my_dude.
{% endhighlight %}
