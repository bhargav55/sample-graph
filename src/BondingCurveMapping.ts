/*eslint prefer-const: "off"*/

import { BigInt } from "@graphprotocol/graph-ts";
import {
    LogBuy as LogBuyEvent,
    LogSell as LogSellEvent,
} from "../generated/templates/BondingCurve/BondingCurve";


import { Balance, BondingCurve, Token, Transaction, } from "../generated/schema";

export function handleLogBuy(event: LogBuyEvent): void {

    let transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.user = event.params.buyer;
    let bondingCurve = BondingCurve.load(event.address.toHexString());
    let tokenAddress = bondingCurve!.token;
    let token = Token.load(tokenAddress!.toHexString());
    transaction.token = token!.id;
    transaction.type = "BUY";
    transaction.input = event.params.totalCost;
    transaction.output = event.params.amountBought;
    transaction.save();

    let balance = Balance.load(event.params.buyer.toHexString() + "-" + token!.id);
    if (balance == null) {
        balance = new Balance(event.params.buyer.toHexString() + "-" + token!.id);
        balance.user = event.params.buyer;
        balance.token = token!.id;
    }
    balance.balance = balance.balance ? balance.balance.plus(event.params.amountBought) : event.params.amountBought;
    balance.save();


}
export function handleLogSell(event: LogSellEvent): void {

    let transaction = new Transaction(event.transaction.hash.toHexString());
    transaction.user = event.params.seller;
    let bondingCurve = BondingCurve.load(event.address.toHexString());
    let tokenAddress = bondingCurve!.token;
    let token = Token.load(tokenAddress!.toHexString());
    transaction.token = token!.id;
    transaction.type = "SELL";
    transaction.input = event.params.amountSell;
    transaction.output = event.params.reward;
    transaction.save();

    let balance = Balance.load(event.params.seller.toHexString() + "-" + token!.id);
    if (balance == null) {
        balance = new Balance(event.params.seller.toHexString() + "-" + token!.id);
        balance.user = event.params.seller;
        balance.token = token!.id;
    }
    balance.balance = balance.balance ? balance.balance.minus(event.params.amountSell) : BigInt.fromI32(0);
    balance.save();


}

