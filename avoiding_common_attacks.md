## SWC-103 (Floating pragma)
Specific compiler pragma 0.8.10 used in contracts to avoid accidental bug inclusion through outdated compiler versions.

## SWC-105 (Unprotected Ether Withdrawal)
Withdraw is protected with OpenZeppelin Ownable's onlyOwner modifier.

## SWC-108 (State Variable Default Visibility)
Explicitly defined visibility for all state variables.

## Modifiers used only for validation
All modifiers in contract(s) only validate data with require statements.

## Checks-Effects-Interactions
All state changes in `Store` contract happen before making external calls.
