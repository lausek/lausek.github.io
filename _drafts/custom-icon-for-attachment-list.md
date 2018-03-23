---
layout: post
---

Transactions like `FB03` (*post documents*) offer you the possibility to attach files to your document. 
SAP Standard doesn't tell you immediately if there are any attachments already appended. To check this, you would have to manually open the attachment list via the button beside your GUI title. 

![the GOS button](/img/assets/gos_button_empty.jpg)

We came to the conclusion that another icon in this place would be great for the workflow.

### Implementation

> What we do now, will influence every transaction that uses this button! I didn't add any branches for excluding tcodes, but you are free to do that of course.

I sat down and started debugging a bit. The class behind the mysterious button is named `CL_GOS_MANAGER`. A quick look inside
unveils the `GET_ICON_NAME` method. This is the point we want to extend. Actually, all of our changes will be done in a class enhancement so there is no need to modify SAP coding.

First, we need to open the class in display mode via `SE24`. We then choose *Class* -> *Enhance*.

![the GOS button](/img/assets/gos_enhance_class.jpg)

Now you need to name your enhancement and assign a package. A success message in the info bar tells you, that your enhancement was created. This enables you to select *Edit* -> *Enhancement Operations* -> *Insert Post-Method* after you positioned your cursor on the `GET_ICON_NAME` function. Also confirm that you want to have access to private members of `CL_GOS_MANAGER` - I swear we won't violate OOP laws. 😉

A pushbutton appears in the "Post-Exit" column inside the methods tab. Hitting it brings you to your local class where you can implement your customizing. The local class receives a reference to the object it is handling by default inside the `core_object` attribute. Before we start hacking stuff into our methods, we first want to tweak our class definition a little bit.

``` abap
CLASS lcl_z_ei_lcb_ext_all_adico DEFINITION.
    PUBLIC SECTION.
        " generated stuff ...
        METHODS:
            constructor 
                IMPORTING core_object TYPE REF TO cl_gos_manager OPTIONAL,
            
            " react on users action
            on_commit_required 
                FOR EVENT commit_required OF cl_gos_srv_attachment_list,
            on_succeeded 
                FOR EVENT service_succeeded OF cl_gos_service,
            on_canceled 
                FOR EVENT service_canceled OF cl_gos_toolbox_view,
            
            " this is where we choose the icon
            get_icon
                RETURNING VALUE(rw_icon) TYPE iconname.

    PRIVATE SECTION.
        DATA:
            " store keys for accessing attachments
            wa_link TYPE sibflporb.
ENDCLASS.
```

Our constructor deserves some extra attention as it is the place where we get the GOS managers reference. We should also do some checks here, 
because the objects model could be initial and using initial variables is painful. This is a very minimal version of what you want to 
have into your initialisation method.

``` abap
" generated stuff here ...

IF core_object IS BOUND
AND core_object->go_model IS BOUND.
    
    " you can probably specify the objects directly somehow
    SET HANDLER:
        on_canceled  FOR ALL INSTANCES,
        on_succeeded FOR ALL INSTANCES.
    
    " get the models "attachment list" service. we'll need 
    " another handler here
    core_object->go_model->get_service_by_name(
        EXPORTING
            ip_service_name   = 'VIEW_ATTA'
        IMPORTING
            es_service        = DATA(lwa_atta_list)
        EXCEPTIONS
            service_not_found = 1
    ).
    
    " check if we got the service we wanted
    IF lwa_atta_list-service IS BOUND.
        TRY.
            SET HANDLER on_commit_required 
                FOR CAST cl_gos_srv_attachment_list( 
                    lwa_atta_list-service
                ).
        CATCH cx_sy_move_cast_error.
        ENDTRY.
    ENDIF.
ENDIF.
```

The implementation of our handlers is pretty straight forward, but also not very optimized. We just pass whatever `GET_ICON` delivers into an update method for our GUI.

``` abap
METHOD on_canceled.
    cl_gos_starter=>display( iv_icon_name = get_icon( ) ).
ENDMETHOD.
  
METHOD on_commit_required.
    cl_gos_starter=>display( iv_icon_name = get_icon( ) ).
ENDMETHOD.

METHOD on_succeeded.
    cl_gos_starter=>display( iv_icon_name = get_icon( ) ).
ENDMETHOD.
```

But before any handler is invoked, `GET_ICON_NAME` (the method we enhanced) is executed. We do some very important setup inside of it.  

``` abap
METHOD ipo_z_ei_lcb_ext_all_adico~get_icon_name.
    
    " little IS BOUND check never hurt nobody
    IF me->core_object IS NOT BOUND.
        RETURN.
    ENDIF.
    
    IF me->wa_link IS INITIAL.
        
        " read the key attributes of the document 
        " we are editing in our transaction
        READ TABLE me->core_object->gt_views INDEX 1
            ASSIGNING FIELD-SYMBOL(<lfs_view>).
            
        IF sy-subrc <> 0.
            RETURN.
        ENDIF.
    
        me->wa_link = CORRESPONDING #( <lfs_view> ).
    ENDIF.
    
    " based on the amount of attachments we have atm: set the icon
    " assign to managers icon and return value in one statement
    rv_icon_name = me->core_object->go_icon_name = get_icon( ).
ENDMETHOD.
```

Comming to terms, `GET_ICON` is where the magic happens. Figuring all of this out was a pain. Everything behaved differently in our systems, so don't be disappointed if it won't work like expected on first try!

``` abap
METHOD get_icon.
    
    DATA:
        li_counts      TYPE sgs_t_acnt,
        lw_attachments TYPE i.
    
    " this method also offers more parameters 
    " for ignoring notes, url, etc.
    li_counts = cl_gos_attachment_query=>count_for_object(
        is_object = wa_link
        " activate this, if you want to read archived documents too
        ip_arl    = abap_false
    ).
    
    " try to extract the amount of attachment from couting table
    " NOTE: this will fail if there are no attachments!
    TRY.
        lw_attachments = li_counts[ uname = '*' ]-counter.
    CATCH cx_sy_itab_line_not_found.
    ENDTRY.
    
    " finally decide which icon to use
    rw_icon = COND #(
        " this is a very nice icon for signalising attachments
        WHEN 0 < lw_attachment THEN 'ICON_WD_VALUE_ATTR'
        ELSE 'ICON_GOS_SERVICES'
    ).
ENDMETHOD.
```

#### Reading archive links

Now, you maybe face the problem, that archived documents aren't considered by this coding. I also had that issue and I fixed it by expanding my method with function module `ARCHIV_GET_CONNECTIONS`.

``` abap
" previous source code ...

DATA:
    li_archived   TYPE STANDARD TABLE OF toav0 WITH EMPTY KEY,
    lwa_linkcopy  TYPE sibflporb,
    
" our link needs to be modified if we 
" read finance document positions
lwa_linkcopy = SWITCH #(
    wa_link-typeid
    WHEN 'BSEG' THEN VALUE #(
        typeid = 'BKPF'
        instid = wa_link-instid(18)
    )
    ELSE wa_link
).

CALL FUNCTION 'ARCHIV_GET_CONNECTIONS'
    EXPORTING
        objecttype  = CONV saeanwdid( lwa_linkcopy-typeid )
        object_id   = CONV saeobjid( lwa_linkcopy-instid )
    TABLES
        connections = li_archived
    EXCEPTIONS
        OTHERS      = 1.

	lw_attachments = lw_attachments + lines( li_archived ).

" setting rw_icon here
```

### Testing

![a gif of our implementation in action](/img/assets/gos_in_action.gif)

### Conclusion

I invested a lot of time into this and it always felt like a hack. The documentation was poor, I had a lot of trouble with my event handler and visibility of class members.

You can read the whole script [here](/extra/gos-icon-enhancement.html).
