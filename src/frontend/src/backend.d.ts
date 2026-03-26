import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Signal {
    id: bigint;
    direction: Direction;
    pair: string;
    section: Section;
    entry: bigint;
    target: bigint;
    timestamp: bigint;
    stoploss: bigint;
    confidence: bigint;
}
export enum Direction {
    buy = "buy",
    sell = "sell"
}
export enum Section {
    amd = "amd",
    smc = "smc",
    gainzalgo = "gainzalgo",
    htgold = "htgold"
}
export interface backendInterface {
    createSignal(section: Section, pair: string, direction: Direction, entry: bigint, target: bigint, stoploss: bigint, confidence: bigint): Promise<bigint>;
    getAllSignals(): Promise<Array<Signal>>;
    readSignal(id: bigint): Promise<Signal | null>;
}
