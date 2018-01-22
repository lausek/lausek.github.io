---
layout: post
---

ABAP offers three different symbols for declaring string- or char-like-variables. Using them wrong is easy.

### The apostrophes `'...'`

Refered to as &quot;text field literals&quot; they are the antique way of creating &quot;strings&quot;. The maximum length of such a char field is 255 characters in editor.

{% highlight abap %}
DATA(w_name) = 'Max'.
&quot; =&gt; Type: C(3)
{% endhighlight %}

### The almighty pipes `|...|`

Officially called &quot;template literals&quot; are used for formatting some output in ABAP. The pipes (or &quot;vertical bars&quot;) make it one of the most beautiful literals currently in use at least from my point of view.

{% highlight abap %}
DATA(w_name) = |Max|.
&quot; =&gt; Type: CString(3)
{% endhighlight %}

#### Why almighty?

Because one can interupt the string via `{ ... }` and insert varying values right into them. When using formatting additions, they can handle so many things which required an own routine before. Just take this example:

{% highlight abap %}
DATA w_betrag TYPE dmbtr VALUE '12345.67'.

&quot; For murica:
WRITE: |Your balance is: { w_betrag COUNTRY = 'US ' }|.
&quot; =&gt; Your balance is: 12,345.67

&quot; For alemania:
WRITE: |Ihre Bilanz beträgt: { w_betrag COUNTRY = 'DE ' }|.
&quot; =&gt; Ihre Bilanz beträgt: 12.345,67
{% endhighlight %}

**Note:** The space behind the country shortcut is important here because exactly three characters are required by `COUNTRY`. I hope SAP fixes that in another release...

### The double quotes `&quot;...&quot;`?

... aren't intended for declaring anything except comments

{% highlight abap %}
DATA(w_name) = &quot;Max&quot;.
&quot; =&gt; Errors
{% endhighlight %}

**But how should I declare ... BACKTICKS!**

### The backticks ``...``

Everytime you need real strings - use them.

{% highlight abap %}
DATA(w_name) = `Max`.
&quot; =&gt; CString(3)
`</pre>

**Another note:** The length-range only applies to hard coded values. Internally CString-variables have arbitrary length while variables of type C always have a fixed length.
