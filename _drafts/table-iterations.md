Table iterations are a broad topic with a lot of little details. They can be used as an addition to `VALUE` and `REDUCE`, while there are some specific features available in each operator. In general we could say, that a table iteration starts with the keyword `FOR`. After that, you are free to choose between a loop over table lines, groups or a classic step iteration with some counter and a terminating predicate.

### Overview

Little syntax overview (everything needs to be wrapped into a `VALUE` or `REDUCE` invocation):
    
``` abap
    * Classic loop
    * --------------------------------------
    ...
    FOR i = 0 THEN i + 1 WHILE i <= 10
    "                    ^^^^^ --- repeat as long as this is true
    "         ^^^^ --- next value of i  
    "   ^^^^^ --- start value

    * Iterating over tables
    * --------------------------------------
    ...
    FOR line IN table ....
    "                 ^^^^ --- place for an optional WHERE condition
    "        ^^ --- repeat for each line in table
    "   ^^^^ --- automatic data detection :O

    * Iterating over groups
    * --------------------------------------
    ...
    FOR <line> IN GROUP group
    "             ^^^^^ --- specify the group you want to iterate over
    "   ^^^^^^ --- automatic field-symbol detection :OO
```

Also, `FOR`s can be nested. The lower one will be executed on each run of its parent. `INDEX INTO ...` can be added on table and group loops to keep track of the line index. This is something, the regular `LOOP` statement misses and I would love to stop using `sy-tabix`, just because it is so unpredictable. 

### Specific for `VALUE`

Table iterations in `VALUE` are also called *table comprehension*. They generate something, but they aren't generators in programming sense. To create a table line, we use parentheses just like we would use `VALUE` without `FOR`.

``` abap
    " Generate one-dimensional table
    DATA(i_numbers) = VALUE t_int(
        FOR i = 1 THEN i + 1 WHILE i < 10
        ( i )
    ).

    " Generate structured table
    DATA(i_customers) = VALUE t_kna1(
        FOR i = 1 THEN i + 1 UNTIL i = 10
        (
            kunnr = CONV numc10( i )
            name1 = |Customer nr. { i }|
        )
    ).
```

The part below our loop is extensible which means that we can append as many lines as we want in one iteration. Just remember, we are allowed to nest table iterations. It basically follows the same principle.

### Specific for `REDUCE`

`REDUCE` requires an additional `INIT` statement on its first line. There you can initialize your workvariables - the first one will act as the result of the whole expression. The whole construct feels a bit like a fold - but it isn't, actually it's worse (state changes). You **have** to do something on each iteration. There is no `CONTINUE` or `SKIP`. I get around this by either prefiltering my tables or using `COND #( WHEN ... )` which will default to 0 in addition. 

**Note:** In newer releases (ABAP 7.50), `REDUCE` can derive its type from the first initialization variable. This would be valid code then:

``` abap
    DATA(w_sum) = REDUCE #(  
        INIT s TYPE i
        ...
    ).
```

### Getting really functional

Some background about the "pure" functional programming: 

> If we know a result for a given input, it's totally fine to map it directly to the corresponding result. We can achieve this by using `COND` or `SWITCH`. 

Just to give you some inspiration for your next project, I've implemented the factorial function in this new style with some `REDUCE` on top. The special thing about factorial calculations is that 0 and 1 both turn into 1.

``` abap
    rw_result = SWITCH #(
        iw_num
        WHEN 0 OR 1 THEN 1
        ELSE REDUCE #(
            INIT f = 1
             FOR x = iw_num THEN x - 1 UNTIL x = 0
            NEXT f = f * x
        )
    ).
```