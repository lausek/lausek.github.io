---
layout: post
tags: abap
---

Have you ever wanted to delete from a table by a list of indizes? You'll often face this while working with ALVs. 

So, recently I was on my tour through the depts of the SAP docu and I discovered one of these "internal developers" commands. The document explicitly states that we should **NOT** use it. Keep that in mind while using it.

``` abap
SYSTEM-CALL ITAB_DELETE_LIST TABLE itab INDEX-LIST itab2.
```

It becomes especially powerful when working with ALV. Maybe you want to delete the marked lines. The thing is, that manually looping over a table of indizes mashes up the order. But, we could fix that by sorting it.
    
``` abap
DATA(li_index) = lo_table->get_selections( )->get_selected_rows( ).

SORT li_index DESCENDING.

LOOP AT li_index
   ASSIGNING FIELD-SYMBOL(<lfs_index>).
    
   DELETE li_data INDEX <lfs_index>.
ENDLOOP.
```

In this example, the whole thing could be replaced by one statement and we can also add `NO-CHECK` if the index table is already sorted in ascending order. Just keep in mind, that this will mess up your order then.

``` abap
SYSTEM-CALL ITAB_DELETE_LIST TABLE li_data INDEX-LIST li_index NO-CHECK.
```

When calling this, you'll have to be absolutely sure, that the index you are trying to delete exists. If it doesn't, a kernel error is raised.
