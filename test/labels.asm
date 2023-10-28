.data   
LabelVeryLong:  .word   5
LabelShort:     .word   10
AnotherLabel:   .asciiz "This is a string"
LabelMed:    .word   20
SomeLabel:      .word   1, 2, 3, 4          # Comment after data

.text   
main:
    li      $t0,    5                       # Load immediate
    add     $t1,    $t0,    $zero           ; Another way to comment

# Blank line above
SomeLabel:
    sub     $t2,    $t1,    $t0             ; Subtract operation

AnotherFunction:
    mult    $t0,    $t1
    mflo    $t3
    syscall 

# Another comment line here
    sw      $t3,    0($sp)

# End of the file.
