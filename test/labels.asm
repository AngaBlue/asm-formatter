.data
LabelVeryLong:  .word       5
LabelShort:     .word       10
AnotherLabel:   .asciiz     "This is a string#;.,\"f"
Ascii:          .ascii      "Unterminated string"
Message:        .halfword   'A'
LabelMed:       .word       20
MultiLine:
                .double     0.1, 0.2, 0.3
                .double     0.4, 0.5, 0.6
                .double     0.7, 0.8, 0.9
Buffer:         .space      100
SomeLabel:      .word       1, 2, 3, 4                  # Comment after data

                .extern     main
                .globl      main
.text

main:                                                   # Entry point
    li      $t0,    5                                   # Load immediate
    add     $t1,    $t0,    $zero                       ; Another way to comment
    li      $t4,    ','                                 # comma
    li      $t4,    ' '                                 # space

    # Blank line above, at the end of a label block
SomeLabel:                                              # Comment here too
    sub     $t2,    $t1,    $t0                         ; Subtract operation

AnotherFunction:
    mult    $t0,    $t1
    mflo    $t3
    syscall

    # Another comment line here, but this time its inside a label
    sw      $t3,    0($sp)

    # End of the file.
