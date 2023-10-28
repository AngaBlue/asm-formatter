main:
    move    $s0,        $zero                   # load 0 into $s0
    li      $s1,        0x10010000              # load address into $s1
    li      $s2,        0x10010190              # load limit of primes $s2

main_loop:
    addi    $s0,        $s0,        1           # increment number
    move    $a0,        $s0                     # load number into $a0
    jal     test_prime
    beq     $v0,        $zero,      main_loop   # if $v0 is 0, go to main_loop

    sw      $s0,        0($s1)                  # store $v0 in memory
    addi    $s1,        $s1,        4           # increment address
    bne     $s1,        $s2,        main_loop   # if not at end continue looping, go to main_loop

    li      $v0,        10                      # exit
    syscall 

test_prime:
    subi    $sp,        $sp,        8
    sw      $s0,        0($sp)
    sw      $s1,        4($sp)
    move    $s0,        $zero
    li      $t0,        2                       # check if less $a0 than 1
    blt     $a0,        $t0,        return      # if less than 2, return false
    li      $s0,        2                       # start division at 2

prime_loop:
    beq     $a0,        $s0,        return      # if divisible by self => prime
    div     $a0,        $s0
    mfhi    $s1                                 # get remainder
    beq     $s1,        $zero,      return      # break out of loop if not prime

    addi    $s0,        $s0,        1           # increment divisor
    j       prime_loop                          # loop again

return:
    slt     $v0,        $s0,        $a0         # check if $s0 is less than $a0
    xori    $v0,        $v0,        0x1         # if so, return true
    lw      $s0,        0($sp)
    lw      $s1,        4($sp)
    addi    $sp,        $sp,        8
    jr      $ra                                 # return false
