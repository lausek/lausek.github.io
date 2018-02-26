---
layout: post
---

Have you ever wanted to delete from a table by a list of indizes? That's something you face while working with ALVs. So, recently I discovered one of these commands SAP doesn't want you to use. At least they state at the top of their documentation. Yet, I wondered why they are hiding it, because there have been many occurrences I wanted to have that functionality.

    SYSTEM-CALL ITAB_DELETE_LIST TABLE itab INDEX-LIST itab2.

It becomes especially powerful when working with ALV. Maybe you want to delete the marked lines. That's one problem I have faced recently. The thing is, that manually looping over a table of indizes mashes up the order. But, we could fix that by sorting it.
	
	DATA(li_index) = lo_table->get_selections( )->get_selected_rows( ).
	
	SORT li_index DESCENDING.

	LOOP AT li_index
       ASSIGNING FIELD-SYMBOL(<lfs_index>).
        
       DELETE li_data INDEX <lfs_index>.
	
	ENDLOOP.

In this example, the whole thing could be replaced by one statement and we can also add `NO-CHECK` if the index table is already sorted in ascending order.

	SYSTEM-CALL ITAB_DELETE_LIST TABLE li_data INDEX-LIST li_index NO-CHECK.
	
### Performance