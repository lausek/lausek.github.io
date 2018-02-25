---
layout: post
---

So, recently I discovered one of these commands SAP doesn't want you to use. At least they state at the top of their documentation. Yet I wondered why they have been hiding it, because there have been many occurrences I wanted to have that functionality.

    SYSTEM-CALL ITAB_DELETE_LIST TABLE itab INDEX-LIST itab2. " & NO-CHECK

It becomes especially powerful when working with ALV. Maybe you want to delete the marked lines. That's one problem I have faced recently. The thing is, that manually looping over a table of indizes mashes up the order. But, we could process it in reversed order.

    SORT li_index DESCENDING.

    LOOP AT li_index
        ASSIGNING FIELD-SYMBOL(<lfs_index>).
        
        DELETE li_data INDEX <lfs_index>.

    ENDLOOP.
