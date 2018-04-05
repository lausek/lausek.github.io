---
layout: script
---

{% highlight abap %}
CLASS lcl_z_ei_lcb_ext_all_adico DEFINITION DEFERRED.
CLASS cl_gos_manager DEFINITION LOCAL FRIENDS lcl_z_ei_lcb_ext_all_adico.
CLASS lcl_z_ei_lcb_ext_all_adico DEFINITION.
    PUBLIC SECTION.
        CONSTANTS c_attachments_set TYPE char30 VALUE 'ICON_WD_VALUE_ATTR'.
        CONSTANTS c_archived_set TYPE char30 VALUE 'ICON_GOS_SERVICES_ATTACHMENT'.
        CONSTANTS c_none_set TYPE char30 VALUE 'ICON_GOS_SERVICES'.
        CLASS-DATA obj TYPE REF TO lcl_z_ei_lcb_ext_all_adico. "#EC NEEDED
        DATA core_object TYPE REF TO cl_gos_manager .           "#EC NEEDED
        INTERFACES  IPO_z_EI_LCB_EXT_ALL_ADICO.
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

CLASS lcl_z_ei_lcb_ext_all_adico IMPLEMENTATION.
    METHOD constructor.
    
        me->core_object = core_object.
    
        " TODO: check transaction code. if anything else than the tested ones -> don't do anything
    
        IF me->core_object IS BOUND
        AND me->core_object->go_model IS BOUND.
    
            SET HANDLER on_canceled FOR ALL INSTANCES.
            SET HANDLER on_succeeded FOR ALL INSTANCES.
    
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
                        FOR CAST cl_gos_srv_attachment_list( lwa_atta_list-service ).
                CATCH cx_sy_move_cast_error.
                ENDTRY.
            ENDIF.
        ENDIF.
    ENDMETHOD.
    
    METHOD get_icon.

        DATA:
            li_counts      TYPE sgs_t_acnt,
            lw_attachments TYPE i.

        li_counts = cl_gos_attachment_query=>count_for_object(
            is_object = wa_link
            " archive will be read later
            ip_arl    = abap_false
        ).

        TRY.
            lw_attachments = li_counts[ uname = '*' ]-counter.
        CATCH cx_sy_itab_line_not_found.
        ENDTRY.
        
        DATA:
            li_archived    TYPE STANDARD TABLE OF toav0 WITH EMPTY KEY,
            lwa_linkcopy   TYPE sibflporb.
        
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
    
        rw_icon = COND #(
            WHEN 0 < lw_attachments THEN c_attachments_set
            ELSE c_none_set
        ).
    ENDMETHOD.
    
    METHOD on_canceled.
        cl_gos_starter=>display( iv_icon_name = get_icon( ) ).
    ENDMETHOD.

    METHOD on_commit_required.
        cl_gos_starter=>display( iv_icon_name = get_icon( ) ).
    ENDMETHOD.

    METHOD on_succeeded.
        cl_gos_starter=>display( iv_icon_name = get_icon( ) ).
    ENDMETHOD.
    
    METHOD ipo_z_ei_lcb_ext_all_adico~get_icon_name.
*"------------------------------------------------------------------------*
*" Declaration of POST-method, do not insert any comments here please!
*" methods GET_ICON_NAME
*"  changing
*"      value(RV_ICON_NAME) type ICONNAME . "#EC CI_VALPAR
*"------------------------------------------------------------------------*

        IF me->core_object IS NOT BOUND.
            RETURN.
        ENDIF.
        
        IF me->wa_link IS INITIAL.
            
            READ TABLE me->core_object->gt_views INDEX 1
                ASSIGNING FIELD-SYMBOL(<lfs_view>).
            
            IF sy-subrc <> 0.
                RETURN.
            ENDIF.
            
            me->wa_link = CORRESPONDING #( <lfs_view> ).
        ENDIF.
        
        " based on the amount of attachments we have atm, set the icon
        rv_icon_name = me->core_object->go_icon_name = get_icon( ). 
    ENDMETHOD.
ENDCLASS.
{% endhighlight %}
