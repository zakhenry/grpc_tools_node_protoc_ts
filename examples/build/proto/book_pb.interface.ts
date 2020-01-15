// package: com.book
// file: book.proto

/* tslint:disable */
/* eslint-disable */

export namespace Book {
    export type AsObject = {
        isbn: number,
        title: string,
        author: string,
    }
}

export namespace GetBookRequest {
    export type AsObject = {
        isbn: number,
    }
}

export namespace GetBookViaAuthor {
    export type AsObject = {
        author: string,
    }
}

export namespace BookStore {
    export type AsObject = {
        name: string,

        booksMap: Array<[number, string]>,
    }
}

export namespace SpecialCases {
    export type AsObject = {
        normal: string,
        pb_default: string,
        pb_function: string,
        pb_var: string,
    }
}

export namespace OneOfSample {
    export type AsObject = {
        a1: boolean,
        b1: boolean,
        a2: boolean,
        b2: boolean,
        nested?: OneOfSample.NestedMessage.AsObject,
    }

    export namespace NestedMessage {
        export type AsObject = {
            foo: string,
        }
    }



    export enum SinglewordCase {
        SINGLEWORD_NOT_SET = 0,
    
    A1 = 1,

    B1 = 2,

    }

    export enum TwoWordsCase {
        TWO_WORDS_NOT_SET = 0,
    
    A_2 = 3,

    B_2 = 4,

    }

}


export enum EnumSample {
    UNKNOWN = 0,
    STARTED = 1,
    RUNNING = 1,
    CASETEST = 2,
    HOW_ABOUT_THIS = 3,
    ALLLOWERCASE = 4,
}
