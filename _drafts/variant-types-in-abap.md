---
layout: post
tags: abap
---

Let's try extending abap with a rich language feature: variant types. Variant types define a special enumerated type - sort of like a union but type safe.

### Result

#### Implementation 1

Everytime we have an operation that could fail, ABAP handles erros quite poorly. Sure, we could use the exception system, but declaring an exception class for every variant takes time and in the end it's still easy to forget implementing the correct handling.

Therefore, we take a value based approach to enforce the handling on access. Simple macros can narrow the declaration to an easy call.

``` abap
" &1 = result typename
" &2 = type 1
" &3 = type 2
DEFINE result.
  TYPES:
    BEGIN OF &1,
      val TYPE REF TO data,
      ok  TYPE &2,
      err TYPE &3,
    END OF &1.
END-OF-DEFINITION.
```

Now we have a type `ty_loadresult` that has a value for each: a correct and a failed operation. For working with this structure we declare another pair of macros.

``` abap
" &1 = reference to result structure
" &2 = value of ok type
DEFINE result_ok.
  &1-ok = &2.
  GET REFERENCE OF &1-ok INTO &1-val.
END-OF-DEFINITION.

" &1 = reference to result structure
" &2 = value of err type
DEFINE result_err.
  &1-err = &2.
  GET REFERENCE OF &1-err INTO &1-val.
END-OF-DEFINITION.
```

In our test scenario we define a routine `load_customer` that plainly exposes the first customer of the database if we give it the right keyword (don't do that).

``` abap
FORM load_customer USING iv_keyword TYPE string CHANGING cs_result TYPE ty_loadresult.
  IF iv_keyword = `secret_key`.
    SELECT SINGLE *
      FROM kna1
      INTO @DATA(ls_kna1).

    result_ok   cs_result ls_kna1.
  ELSE.
    result_err  cs_result `keyword was wrong. try with "secret_key" again`.
  ENDIF.
ENDFORM.
```

To access the components of such a structure we would check if the `err` field is initial and - if not - continue with the `ok` field. We can also access the generic field `val` if we do not care about the type at all.

``` abap
" declare a value type for our customer retrievement
result ty_loadresult kna1 string.

START-OF-SELECTION.
  PERFORM test USING `/home/result_ok`.
  PERFORM test USING ``.

FORM test USING iv_path TYPE string.
  DATA(gs_operation) = VALUE ty_loadresult( ).
  PERFORM load_file USING iv_path CHANGING gs_operation.

  IF gs_operation-err IS INITIAL.
    WRITE: 'Success', gs_operation-ok-kunnr. NEW-LINE.
  ELSE.
    WRITE: 'Error', gs_operation-err. NEW-LINE.
  ENDIF.
ENDFORM.
```

#### Implementation 2

After the first implementation I wrapped my mind about implementing the underlying type as a class. This way, the whole creation process can be done in a more appealing way and working with an instance of such a type becomes more easier in general, but harder in certain cases (which is not bad as I will show you).

``` abap
" &1 = result typename
" &2 = type 1
" &3 = type 2
CLASS &1 DEFINITION
    CREATE PRIVATE.
    PUBLIC SECTION.
        CONSTANTS:
            tag_ok  TYPE i DEFAULT 1,
            tag_err TYPE i DEFAULT 2.
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
        DATA:
            tag TYPE i,
            ok  TYPE &2,
            err TYPE &3.
ENDCLASS.
CLASS &1 DEFINITION.
    METHOD ok.
        DATA(lo_ref) = NEW &1(  ).
        lo_ref->tag = tag_ok.
        lo_ref->ok = iv_val.
    ENDMETHOD.

    METHOD err.
        DATA(lo_ref) = NEW &1(  ).
        lo_ref->tag = tag_err.
        lo_ref->err = iv_val.
    ENDMETHOD.

    METHOD is_ok.
        rv_correct = boolc( me->tag = tag_ok ).
    ENDMETHOD.

    METHOD unwrap.
        ASSERT me->tag = tag_ok.
        rs_ok = me->ok.
    ENDMETHOD.

    METHOD unwrap_err.
        ASSERT me->tag = tag_err.
        rs_err = me->err.
    ENDMETHOD.
ENDCLASS.
```

Now we can instantiate results (only) by using the static methods `ok` and `err`.

``` abap
result ty_sigma i string.

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
result_let_ok lo_result1 lv_num.
    WRITE: `our number is`, lv_num.
ELSE.
    " alternative error handling
    WRITE: lo_result1->unwrap_err( ), /.
ENDIF.

" fails due to ASSERT
DATA(lv_dont_care) = lo_result2->unwrap( ).
```

### Lookout

This is a pretty naive implementation from a young idea. Maybe it is more appropriate to generate the variant type as a class and use methods for access later.

I just discovered that you can use that way of writing to implement generics in a way that is also very comparable to Rust.
