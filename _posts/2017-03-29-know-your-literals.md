---
layout: post
---

ABAP offers three different symbols for declaring string- or char-like-variables. Using them wrong is easy.

### The apostrophes `'...'`

Refered to as "text field literals" they are the antique way of creating "strings". The maximum length of such a char field is 255 characters in editor.

{% highlight abap %}
DATA(w_name) = 'Max'.
" => Type: C(3)
{% endhighlight %}

### The almighty pipes `|...|`

Officially called "template literals" are used for formatting some output in ABAP. The pipes (or "vertical bars") make it one of the most beautiful literals currently in use at least from my point of view.

{% highlight abap %}
DATA(w_name) = |Max|.
" => Type: CString(3)
{% endhighlight %}

#### Why almighty?

Because one can interupt the string via `{ ... }` and insert varying values right into them. When using formatting additions, they can handle so many things which required an own routine before. Just take this example:

{% highlight abap %}
DATA w_betrag TYPE dmbtr VALUE '12345.67'.

" For murica:
WRITE: |Your balance is: { w_betrag COUNTRY = 'US ' }|.
" => Your balance is: 12,345.67

" For alemania:
WRITE: |Ihre Bilanz beträgt: { w_betrag COUNTRY = 'DE ' }|.
" => Ihre Bilanz beträgt: 12.345,67
{% endhighlight %}

**Note:** The space behind the country shortcut is important here because exactly three characters are required by `COUNTRY`. I hope SAP fixes that in another release...

### The double quotes `"..."`?

... aren't intended for declaring anything except comments

{% highlight abap %}
DATA(w_name) = "Max".
" => Errors
{% endhighlight %}

**But how should I declare ... BACKTICKS!**

### The backticks ``...``

Everytime you need real strings - use them.

{% highlight abap %}
DATA(w_name) = `Max`.
" => CString(3)
{% endhighlight %}
