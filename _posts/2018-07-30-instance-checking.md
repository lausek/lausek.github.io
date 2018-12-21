---
layout: post
tags: abap
---

**TLDR**: Use `IS INSTANCE OF` for a single check and `CASE TYPE OF` for multiple class or interface checks.

```abap
DATA(o_bj) = NEW lcl_child( ).

IF o_bj IS INSTANCE OF lcl_parent.
    WRITE 'instance of lcl_parent'.
ENDIF.
" => instance of lcl_parent

IF o_bj IS INSTANCE OF lcl_child.
    WRITE 'instance of lcl_child'.
ENDIF.
" => instance of lcl_child
```

When using the `CASE TYPE OF` statement, the first possible superclass will be matched, which is obviously correct but maybe not the result you expected.

```abap
DATA(o_bj) = NEW lcl_child( ).

CASE TYPE OF o_bj.
    WHEN TYPE lcl_parent.
        WRITE 'parent'.

    WHEN TYPE lcl_child.
        WRITE 'child'.

ENDCASE.
" => parent

CASE TYPE OF o_bj.
    WHEN TYPE lcl_child.
        WRITE 'child'.

    WHEN TYPE lcl_parent.
        WRITE 'parent'.

ENDCASE.
" => child
```

These new commands make dynamic programming with RTTI way smoother. Whenever I needed some dynamic type description, I had to make sure every cast worked well.

```abap
TRY.
        DATA(lo_structdescr) = CAST cl_abap_structdescr( io_descr ).
        "... Do something
        
    CATCH cx_sy_move_cast_error.
        DATA(lo_elemdescr) = CAST cl_abap_elemdescr( io_descr ).
        "... Do something else
        
ENDTRY.
```

I'm now able to shorten it to a cleaner variant:

```abap
CASE TYPE OF io_descr.
    WHEN TYPE cl_abap_structdescr INTO DATA(lo_structdescr).
    "... Do something

    WHEN TYPE cl_abap_elemdescr INTO DATA(lo_elemdescr).
    "... Do something else

ENDCASE.
```