use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

use crate::{ORIGINAL_MINT_ADDRESS, STAKE_MINT_ADDRESS};

pub fn unstake_handler(
  ctx: Context<Unstake>,
  program_original_account_bump: u8,
  stake_amount: u64,
) -> Result<()> {
  let cpi_ctx = CpiContext::new(
    ctx.accounts.token_program.to_account_info(),
    token::Burn {
      mint: ctx.accounts.stake_mint.to_account_info(),
      from: ctx.accounts.user_stake_token_account.to_account_info(),
      authority: ctx
        .accounts
        .user_stake_token_account_authority
        .to_account_info(),
    },
  );
  token::burn(cpi_ctx, stake_amount)?;

  let beef_mint_address = ctx.accounts.original_mint.key();
  let seeds = &[beef_mint_address.as_ref(), &[program_original_account_bump]];
  let signer = [&seeds[..]];

  let cpi_ctx = CpiContext::new_with_signer(
    ctx.accounts.token_program.to_account_info(),
    token::Transfer {
      from: ctx
        .accounts
        .program_original_token_account
        .to_account_info(),
      authority: ctx
        .accounts
        .program_original_token_account
        .to_account_info(),
      to: ctx.accounts.user_original_token_account.to_account_info(),
    },
    &signer,
  );

  // Formula
  let original_amount = stake_amount;
  token::transfer(cpi_ctx, original_amount)?;

  Ok(())
}

#[derive(Accounts)]
#[instruction(program_original_account_bump: u8)]
pub struct Unstake<'info> {
  pub token_program: Program<'info, Token>,
  #[account(mut, address = STAKE_MINT_ADDRESS.parse::<Pubkey>().unwrap())]
  pub stake_mint: Account<'info, Mint>,
  #[account(mut)]
  pub user_stake_token_account: Account<'info, TokenAccount>,
  pub user_stake_token_account_authority: Signer<'info>,
  #[account(mut, seeds = [ original_mint.key().as_ref() ], bump = program_original_account_bump)]
  pub program_original_token_account: Account<'info, TokenAccount>,
  #[account(mut)]
  pub user_original_token_account: Account<'info, TokenAccount>,
  #[account(address = ORIGINAL_MINT_ADDRESS.parse::<Pubkey>().unwrap())]
  pub original_mint: Box<Account<'info, Mint>>,
}
