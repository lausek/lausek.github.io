---
layout: post
tags: abap
---

**Note:** All these things require ABAP 7.40 SP05 or higher!

The new OpenSQL implements stuff, web developers already know as **S-Q-L**, but anyway... With these things finally available, we can do all the neat data processings. Such fun. Much wow. Trust me, it's true.

### Don't fear the new syntax

As my colleagues have noticed that I am using `@`-signs in my SQL statements and commas in the field list, they all got very worried. Yeah, it looks strange at first glance but once you know what it does...

Short answer: **nothing**

There really is no special functionality behind. You just have to prefix every program-intern variable with an `at`, so the query parser doesn't get confused about its own data. Using commas to separate the selected columns already is common practice in nearly every other structured query language.

### Making use of declaration operators

Declaring structures by hand is lame, time-consuming and sooooo unnecessary. Everything is there. Compiler? How about just take it by yourself?!

This is just a very basic code snippet that fetches customers from company code 3000 with their names before 7.4:

{% highlight abap %}
TYPES:
BEGIN OF t_data_s,
    bukrs TYPE bukrs,
    kunnr TYPE kunnr,
    name1 TYPE name1,
    name2 TYPE name2,
END OF t_data_s.
DATA i_data TYPE STANDARD TABLE OF t_data_s WITH KEY bukrs kunnr.

SELECT b~bukrs b~kunnr a~name1 a~name2
  FROM knb1 AS b
  JOIN kna1 AS a
    ON a~kunnr = b~kunnr
  INTO TABLE i_data
 WHERE b~bukrs = '3000'.
{% endhighlight %}

Now look at that one. Beautiful.

{% highlight abap %}
SELECT b~bukrs, b~kunnr, a~name1, a~name2
  FROM knb1 AS b
  JOIN kna1 AS a
    ON a~kunnr = b~kunnr
  WHERE b~bukrs = '3000'
  INTO TABLE @DATA(i_data).
{% endhighlight %}

But what if we want to move the value of `name1` into `fullname` instead of `name1`? We would have to declare another column named `fullname`, alias `name1` and extend `INTO TABLE` with `CORRESPONDING FIELDS OF`. That's too much for me. We just do it this way:

{% highlight abap %}
SELECT b~bukrs, b~kunnr, a~name1 AS fullname, a~name2
  FROM knb1 AS b
  JOIN kna1 AS a
    ON a~kunnr = b~kunnr
  WHERE b~bukrs = '3000'
  INTO TABLE @DATA(i_data).

" i_data is typed! You can access each component individually!
{% endhighlight %}

You see: one `AS` is enough to nickname a field.

### More precise selection

The only thing I want to mention here is that you can now select `*` from a specific table instead of just **ALL**.

Before 7.4:

{% highlight abap %}
SELECT *
    FROM table1
    JOIN table2
...
{% endhighlight %}

> Little guessing game: What could be the output of above code?
>
> - All fields from table1
> - All fields from table2
> - All fields from all tables

Answer: "ERROR: Too many fields specified" because all fields are specified even though nobody wants to select everything from every table... Now:

{% highlight abap %}
" Pfewww. Gotcha!
SELECT table1~*
    FROM table1
    JOIN table2
...
{% endhighlight %}

I think there should be no doubt about which one is better, right?

### About expressions

Computing results wasn't really possible in the old OpenSQL. I can't even find any computation in my code at all. Here are only a few snippets of the new possibilities.

Calculating..

{% highlight abap %}
SELECT num1 + num2, num1 - num2, num1 * num2, num1 / num2 ...
{% endhighlight %}

Concatenating...

{% highlight abap %}
SELECT name1 && name2 ...
{% endhighlight %}

Calling inbuilt functions...

{% highlight abap %}
SELECT abs( num ), ceil( num ), floor( num ) ...
{% endhighlight %}

Casting (pretty useless atm as only float and dec are allowed)...

{% highlight abap %}
SELECT cast( dmbtr AS fltp ) ...
{% endhighlight %}

Coalesce...

{% highlight abap %}
SELECT coalesce( num1, num2 ), coalesce( NULL, num2 ) ...
{% endhighlight %}

### The infamous `CASE`

We can finally select stuff based on a condition inside queries 🎉. There are two possible forms:

    - Like `COND` or `IF ... ELSEIF ... ELSE`:
    {% highlight abap %}
    CASE " nothing in this place
        WHEN state = 1 THEN ...
        WHEN state = 2 THEN ...
        ELSE ...
    END
    {% endhighlight %}

    - Like `CASE` or `SWITCH`:
    {% highlight abap %}
    CASE state
        WHEN 1 THEN ...
        WHEN 2 THEN ...
        ELSE ...
    END
    {% endhighlight %}

You are free to replace <em>...</em> with a type compatible column or another SQL expression.

### Let's get you creative!

If you ever wondered how to correctly (in terms of debit and credit) sum up `BSID` without any looping - there you go:

{% highlight abap %}
SELECT SUM( CASE shkzg
                WHEN 'H' THEN dmbtr
                WHEN 'S' THEN dmbtr * -1 " negate for subtraction
            END )
    FROM bsid
    WHERE bukrs = @<bukrs>
    AND kunnr = @<kunnr>
    AND rebzg = @<belnr>
    INTO @DATA(w_payed).
{% endhighlight %}

Wanna join names without `CONCATENATE`? What do you think about this?

{% highlight abap %}
SELECT SINGLE name1 && name2 AS fullname,
              name1 && 'y' AS nick
    FROM kna1
    INTO @DATA(wa_somebody).

WRITE: |Somebodys name is "{ wa_somebody-fullname }" but his friends call him "{ wa_somebody-nick }"|.
" => Somebodys name is "Bob Bobington" but his friends call him "Boby"
{% endhighlight %}
