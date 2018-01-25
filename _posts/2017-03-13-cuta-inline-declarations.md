---
layout: post
---

Since ABAP 7.40 has been introduced, we are lucky to have two very neat operators: `DATA` and `FIELD-SYMBOL`. Both can be used with this syntax:

{% highlight abap %}
<operator>(<variable_name>) = <some_val>
{% endhighlight %}                                            

Direct assigments like the example above are only supported by `DATA`, but you could also place them...

 - after `.. INTO` statements or as the target of an `IMPORTING` parameter
 - after `ASSIGN`/`ASSIGNING` statements (`READ TABLE`, `LOOP AT`)

The type of the declarable symbol has to be known at compile-time, because... type-checking. Inline declarations aren't dynamic - they are fully typed and as such could be checked by a computer.

The compiler will insert a declaration right before calls to declaration operators:

![insert](/img/assets/insert.png)

Following statements create exact the same variables:

{% highlight abap %}
" TYPE:
DATA w_num  TYPE i VALUE 10.                " I(4)
DATA w_char TYPE c VALUE 'Test' LENGTH 4.   " C(4)
DATA w_str  TYPE string VALUE `Test`.       " CString

DATA(w_num)     = 10.                       " I(4)
DATA(w_char)    = 'Test'.                   " C(4)
DATA(w_str)     = `Test`.                   " CString
{% endhighlight %}

Using declaration operators in combination with loops becomes also very handy:

{% highlight abap %}
* Old
DATA wa_line LIKE LINE OF i_table.
LOOP AT i_table INTO wa_line.
    " work with wa_line
ENDLOOP.

* New
LOOP AT i_table INTO DATA(wa_line).
    " work with wa_line
ENDLOOP.

*--------------------------------------------------

* Old
FIELD-SYMBOL <fs_line> LIKE LINE OF i_table.
LOOP AT i_table ASSIGNING <fs_line>.
    " work with <fs_line>
ENDLOOP.

* New
LOOP AT i_table ASSIGNING FIELD-SYMBOL(<fs_line>).
    " work with <fs_line>
ENDLOOP.
{% endhighlight %}

> Every declared token stays in scope and is available even after `LOOP AT` is already done.
