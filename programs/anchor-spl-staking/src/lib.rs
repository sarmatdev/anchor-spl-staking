use anchor_lang::prelude::*;

declare_id!("2RLGCgJVFCc7frbJJBFRxsXuJ3rsUKoKCg5XQ6SLzvR9");

#[program]
pub mod anchor_spl_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
