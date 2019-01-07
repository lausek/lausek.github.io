---
layout: post
tags: abap
---

In this post I want to show off my recently created repo [aresult](https://github.com/lausek/aresult.git) which brings a rich feature to ABAP: variant types. 

Variant types define a special enumerated type - sort of like a union but safe. The fundemental idea behind encapsulating a result in another value basically is that we would have to take another step for retrieving the actual outcome, thus ensuring that the programmer becomes aware of an error case. 

State of the art in ABAP OO - or object-oriented languages in general - would require us to define an exception class for every possible fault occurrence while a simple message would often be sufficient. The ABAP compiler also doesn't enforce handling errors (little double-edged sword) and unhandled exceptions are therefore easy to obtain.

So why don't we just say that the return of a function could either be an error (later called `Err`) or the output of a correctly executed operation (also named `Ok`). Clearly, we want to have a distinction between the inner types of both variants. Our `Err` needs to hold a string like *"customer not found"* and `Ok` wants an `int4` for summation for example.

### Implementation

After a first procedural implementation I wrapped my mind about implementing the underlying type as a class. This way, the whole creation process can be done in a quite appealing way and working with an instance of such a type becomes simpler in general, but harder in certain cases (which is not bad as I will show you).

``` abap
" &1 = result typename
" &2 = type 1
" &3 = type 2
DEFINE declare_result.
    CLASS &1 DEFINITION
        CREATE PRIVATE.
        PUBLIC SECTION.
        TYPES:
            ok_type  TYPE &2,
            err_type TYPE &3.
        CLASS-METHODS:
                ok
                    IMPORTING
                        iv_val TYPE &2,
                    PREFERRED PARAMETER iv_val
                    RETURNING VALUE(rs_variant),
                err
                    IMPORTING
                        iv_val TYPE &3,
                    PREFERRED PARAMETER iv_val
                    RETURNING VALUE(rs_variant).
            METHODS:
                is_ok
                    RETURNING VALUE(rv_correct) TYPE abap_bool,
                unwrap
                    RETURNING VALUE(rs_ok) TYPE &2,
                unwrap_err
                    RETURNING VALUE(rs_err) TYPE &3.
        PRIVATE SECTION.
            CONSTANTS:
                tag_ok  TYPE i DEFAULT 1,
                tag_err TYPE i DEFAULT 2.
            DATA:
                _tag TYPE i,
                _ok  TYPE &2,
                _err TYPE &3.
    ENDCLASS.
    " ... see github for implementation
END-OF-DEFINITION.
```

### Usage

After including this macro we can instantiate results (only) by using the static methods `ok` and `err`.

``` abap
declare_result ty_sigma i string.

DATA(lo_result1) = ty_sigma=>ok( 1510 ).
DATA(lo_result2) = ty_sigma=>err( `there was an error` ).
```

Just by looking at the above stated class definition you see that we can shorten a pretty idomatic expression with another macro.

``` abap
" &1 = name of result value
" &2 = name of variable to be declared value
DEFINE result_let_ok.
IF &1->is_ok( ).
    DATA(&2) = &1->unwrap( ).
END-OF-DEFINITION.
```

With this macro we integrate result checking beautifully.

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

### Lookout

With macros we can simulate generics very primitively. Of course this doesn't work well on a big scale, e.g. I wouldn't implement a class with hundreds of code lines in one, but it is suitable enough for declaring small, compact helper types. 

Unfortunately, I haven't found a way of sharing such a declaration over the SAP Dictionary.

I like the idea of macro backed generics in ABAP and I'm curious about more tools like this one.
