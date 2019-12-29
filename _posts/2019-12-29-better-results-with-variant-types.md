---
layout: post
tags: abap
---

In this post I want to show off my repo [aresult](https://github.com/lausek/aresult.git) which tries to introduce a rich feature to ABAP: variant types. 

Variant types define a special enumerated type which means you can either store a value of `type1` or a value of `type2` in it - but not both at the same time. The fundamental idea behind encapsulating a result in another value basically is that we would have to take another step for retrieving the actual outcome, thus ensuring that the programmer becomes aware of an error case. 

State of the art in ABAP OO - or object-oriented languages in general - would require us to define an exception class for every possible fault occurrence while a simple message would often be sufficient. The ABAP compiler also doesn't enforce handling errors (little double-edged sword) and unhandled exceptions are therefore easy to obtain.

So why don't we just say that the return of a function could either be an error (later called `err`) or the output of a correctly executed operation (also named `ok`). Clearly, we want to have a distinction between the inner types of both variants. Our `err` needs to hold a string like *"customer not found"* and `ok` wants an `int4` e.g. for summation.

### Usage

After including the project, we can (only) instantiate results by using the static methods `ok` and `err`. This guarantees that we cannot change the inner data once creation has happened. 

``` abap
type_result ty_sigma i string.

DATA(lo_result1) = ty_sigma=>ok( 1510 ).
DATA(lo_result2) = ty_sigma=>err( `there was an error` ).
```

If our result instance is of type `ok` we want to extract the wrapped value and do further processing. As this is a pretty idomatic operation, we can shorten it using `if_ok_let`.

``` abap
if_ok_let lo_result1 lv_num.
    WRITE: `our number is`, lv_num.
ELSE.
    " alternative error handling
    WRITE: lo_result1->unwrap_err( ), /.
ENDIF.

" fails due to ASSERT
DATA(lv_dont_care) = lo_result2->unwrap( ).
```

### Implementation

After a first procedural implementation I wrapped my mind about implementing the underlying type as a class. This way, the whole creation process can be done in a quite appealing way and working with an instance of such a type becomes simpler in general.

See implementation [here](https://github.com/lausek/aresult/blob/master/src/zaresult.prog.abap).

### Final thoughts

Making use of macros enables us to simulate generics very primitively. Of course this doesn't work well on a big scale - I wouldn't implement a class with hundreds of code lines in one - but it is suitable enough for declaring small, compact helper types. 

Unfortunately, I haven't found a way of reusing such a declaration over the SAP Dictionary. If you really need to share `result` types, you would need to place them in an extra include.
