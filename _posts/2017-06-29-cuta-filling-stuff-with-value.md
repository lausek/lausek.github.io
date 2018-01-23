---
layout: post
---

`VALUE` can create "throwaway"-objects of non-generic type in a simplified way. Furthermore, there is the possibility to prefill structures and tables in the same command. But you shouldn't be ashamed to use the classical `DATA ... TYPE ...` form in certain cases - especially not when declaring one dimensional tokens and/or giving default values isn't needed.

Always keep in mind that your type has to be fully specified. `c, x, p, n` won't work without a length specification. `string` is fine though.

{% highlight abap %}
DATA(w_char) = VALUE c( ).      " error; length unknown
DATA(w_char) = VALUE char1( ).  " works; length is 1

" ... acts like ...

DATA w_char TYPE c LENGTH 1.
{% endhighlight %}

For structures inside `VALUE`, we go with this syntax: `( <component> = <value> <component> = <value> ... )`.

Whenever I need to enable layout saving in my SALV table, I implement it using this very useful pattern:

{% highlight abap %}
o_layout->set_key( VALUE #( report = sy-repid ) ).
{% endhighlight %}

### Creating tables

But thats not all. We can also use some extra syntax elements to construct internal tables. Let's say we want to fill a select option in our program. Obviously, the old-school way would be:

{% highlight abap %}
" We'll need this later too
TYPES t_users_tt TYPE RANGE OF uname.

DATA: 
    i_selopts TYPE t_users_tt,
    wa_selopt LIKE LINE OF i_selopts.

wa_selopt-sign   = 'I'.
wa_selopt-option = 'EQ'.
wa_selopt-low    = 'PE000001'.
APPEND wa_selopt TO i_selopts.

wa_selopt-low    = 'PE000002'.
APPEND wa_selopt TO i_selopts.

" ...
{% endhighlight %}

Stop this insanity from now on and have a look at the lazy guy's writing style where every pair of parenthesis represents a table line:

{% highlight abap %}
DATA(i_selopts) = VALUE t_users_tt(
    ( sign = 'I' option = 'EQ' low = 'PE000001' )
    ( sign = 'I' option = 'EQ' low = 'PE000002' )
    ( sign = 'I' option = 'EQ' low = 'PE000003' )
).

" common parts can be moved over the parentheses
DATA(i_selopts) = VALUE t_users_tt(
    sign = 'I' option = 'EQ'
    ( low = 'PE000001' )
    ( low = 'PE000002' )
    ( low = 'PE000003' )
).
{% endhighlight %}

We can also extend existing tables - very useful when giving default values to select-options:

{% highlight abap %}
" # -> determine type automatically
APPEND VALUE #( low = sy-datum )  TO s_audat.
APPEND VALUE #( low = sy-datum )  TO s_cpudt.
APPEND VALUE #( high = '235959' ) TO s_cputm.
{% endhighlight %}

#### Running into errors

So you have defined your first table type and you're very hyped to try this articles topic out by yourself. But if you haven't specified your key, you'll surely run into an error saying:

> A value of the generic type "T_MY_TABLE" cannot be constructed.

"Hmmm. That's disappointing. I don't care if this makes my life easier. I'll just continue with my working template..." - waiiiiit. This can be fixed in one simple step. Just add `WITH EMPTY KEY` to your table definition.

{% highlight abap %}
TYPES t_my_table TYPE STANDARD TABLE OF t_my_type.                " will produce error
TYPES t_my_table TYPE STANDARD TABLE OF t_my_type WITH EMPTY KEY. " will work
{% endhighlight %}

What does this change? It will make your type non-generic. In the end your variables get handled more like an array, without any consideration of table keys. For the future, you should train yourself to add `WITH EMPTY KEY` at the end of your definition. It is considered a better practice than not having dropped any word about your tables keys.

### Fin

A very interesting part of this operator is the support for table comprehensions and iterations. Not only are those also compatible with `REDUCE`, they have too many details for a short explanation here as well. An own article is incoming...
