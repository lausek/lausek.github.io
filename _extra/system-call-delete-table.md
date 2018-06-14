---
layout: script
---

{% highlight abap %}
REPORT z_perftest.

" preparation

SELECT * FROM kna1
  INTO TABLE @DATA(i_data)
  UP TO 100 ROWS.

TYPES t_index_tt TYPE STANDARD TABLE OF i WITH EMPTY KEY.

DATA(i_index) = VALUE t_index_tt(
  FOR i = 1 THEN i + 10 UNTIL 100 < i
  ( i )
).

DATA:   i_copy LIKE i_data,
        w_start TYPE timestampl,
        w_end TYPE timestampl.

i_copy[] = i_data[].

DEFINE m_start.
  i_data[] = i_copy[].
  GET TIME STAMP FIELD w_start.
END-OF-DEFINITION.

DEFINE m_end.
  GET TIME STAMP FIELD w_end.
  WRITE: &1, ' ran ', |{ w_end - w_start }|. NEW-LINE.
END-OF-DEFINITION.

" initial run - ignore this

m_start.
DATA(w_index3) = lines( i_index ).
WHILE 1 <= w_index3.
  ASSIGN i_index[ w_index3 ] TO FIELD-SYMBOL(<lfs_index3>).
  DELETE i_data INDEX <lfs_index3>.
  w_index3 = w_index3 - 1.
ENDWHILE.
m_end 'initial run'.

" start runs

m_start.
DATA(w_index2) = lines( i_index ).
WHILE 1 <= w_index2.
  ASSIGN i_index[ w_index2 ] TO FIELD-SYMBOL(<lfs_index2>).
  DELETE i_data INDEX <lfs_index2>.
  w_index2 = w_index2 - 1.
ENDWHILE.
m_end 'While loop'.

m_start.
SYSTEM-CALL ITAB_DELETE_LIST TABLE i_data INDEX-LIST i_index.
m_end 'Checked'.

m_start.
DATA(w_index) = lines( i_index ).
DO.
  IF w_index < 1.
    EXIT.
  ENDIF.
  ASSIGN i_index[ w_index ] TO FIELD-SYMBOL(<lfs_index>).
  DELETE i_data INDEX <lfs_index>.
  w_index = w_index - 1.
ENDDO.
m_end 'Do loop'.

m_start.
SYSTEM-CALL ITAB_DELETE_LIST TABLE i_data INDEX-LIST i_index NO-CHECK.
m_end 'Not checked'.
{% endhighlight %}
