---
layout: post
---

So, recently I discovered one of these commands SAP doesn't want you to use. At least they state at the top of their documentation. Yet I wondered why they have been hiding it, because there have been many occurrences I wanted to have that functionality.

    SYSTEM-CALL ITAB_DELETE_LIST TABLE itab INDEX-LIST itab2. " & NO-CHECK
