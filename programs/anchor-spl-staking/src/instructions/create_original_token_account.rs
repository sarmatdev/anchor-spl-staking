use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::ORIGINAL_MINT_ADDRESS;

pub fn create_original_token_account_handler(
  _ctx: Context<CreateOriginalTokenAccount>,
) -> Result<()> {
  Ok(())
}

#[derive(Accounts)]
pub struct CreateOriginalTokenAccount<'info> {
  #[account(
        init,
        payer = payer,
        seeds = [ ORIGINAL_MINT_ADDRESS.parse::<Pubkey>().unwrap().as_ref() ],
        bump,
        token::mint = original_mint,
        token::authority = program_original_token_account,
    )]
  pub program_original_token_account: Account<'info, TokenAccount>,
  #[account(
        address = ORIGINAL_MINT_ADDRESS.parse::<Pubkey>().unwrap(),
    )]
  pub original_mint: Account<'info, Mint>,
  #[account(mut)]
  pub payer: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub rent: Sysvar<'info, Rent>,
}
