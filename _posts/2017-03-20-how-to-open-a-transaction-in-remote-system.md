---
layout: post
tags: abap
---

Once my task was to write a report which compares master data (customers, vendors) from the current system to another one over RFC. Hotspot jumps into maintenance views were also required...

> ***le colleague testing my program***
>
> **colleague:** When I click on this, FD03 doesn't open in &lt;remote_system_xy&gt;
>
> **me:** lol yeah... and??

I bet you would have had the same thoughts if you were in my place. At first I really felt like my coworker didn't get, that this would require a call to a whole other system, but apparently it is no problem to do such a thing. You probably won't find a system that doesn't support function module `RFC_CALL_TRANSACTION_USING` - so don't worry about backwards compatibility.

The call itself is very intuitive once you know that navigating works via batch input.

{% highlight abap %}
" Table for errors (required)
DATA li_error TYPE STANDARD TABLE OF bdcmsgcoll.

" Create a batch file for prefilling the input mask
DATA(li_table) = VALUE bdcdata_tab(
                    ( dynbegin = 'T' fnam = 'FD03' )
                    ( program = 'SAPMF02D' dynpro = '0106' dynbegin = 'X' )
                    ( fnam = 'RF02D-KUNNR' fval = '<customer_number>' )
                    ( fnam = 'RF02D-BUKRS' fval = '<company_code>' )
                    ( fnam = 'RF02D-D0110' fval = abap_true )
                    ( fnam = 'RF02D-D0120' fval = abap_true )
                    ( fnam = 'BDC_OKCODE'  fval = '/00' )
                ).

CALL FUNCTION 'RFC_CALL_TRANSACTION_USING'
    DESTINATION '<destination_xy>'
    EXPORTING
        tcode                   = 'FD03'
        mode                    = 'E'       " Allow user to view the output of FD03
    TABLES
        bt_data                 = li_table
        l_errors                = li_error
    EXCEPTIONS
        authority_not_available = 1
        communication_failure   = 2
        system_failure          = 3
        OTHERS                  = 4.

IF sy-subrc <> 0.
    MESSAGE ID sy-msgid TYPE sy-msgty NUMBER sy-msgno
        WITH sy-msgv1 sy-msgv2 sy-msgv3 sy-msgv4.
ENDIF.
{% endhighlight %}

If you have no clue about handcrafting batch input processes (like I do), I recommend recording a test run with transaction SM35.
