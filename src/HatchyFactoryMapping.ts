/*eslint prefer-const: "off"*/
import {
    TokenCreated as TokenCreatedEvent,
  
  } from "../generated/HatchyFactory/HatchyFactory";
  import { ERC20 as Contract } from "../generated/ERC20/ERC20";
  
  import { Token, BondingCurve } from "../generated/schema";
  import { BondingCurve as BondingCurveTemplate } from '../generated/templates';
  export function handleTokenCreated(event: TokenCreatedEvent): void {
  
    let token = Token.load(event.params.token.toHexString());
    if (token == null) {
      token = new Token(event.params.token.toHexString());
      let tokenContract = Contract.bind(event.params.token);
      token.name = tokenContract.name();
      token.symbol = tokenContract.symbol();
      token.tokenURI = tokenContract.tokenURI();
      token.totalSupply = tokenContract.totalSupply();
      token.address = event.params.token;
      token.owner = event.transaction.from;
      token.save();
    }
    let bondingCurve = BondingCurve.load(event.params.bondingCurve.toHexString());
    if (bondingCurve == null) {
      bondingCurve = new BondingCurve(event.params.bondingCurve.toHexString());
      bondingCurve.address = event.params.bondingCurve;
      bondingCurve.token = event.params.token;
      bondingCurve.save();
    }
    BondingCurveTemplate.create(event.params.bondingCurve);
  }
  
  