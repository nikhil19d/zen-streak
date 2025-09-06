import { NextResponse } from "next/server"
import { UnAuthorizedError } from "./error"

export function withErroHandler<T extends (...args: any[]) => Promise<Response>>(handler: T) {
  return (async (...args: Parameters<T>): Promise<Response> => {
    try {
      return await handler(...args)
    } catch (e) {
      if (e instanceof UnAuthorizedError) return NextResponse.json({
        success: false,
        message: e.message
      }, {
        status: 401
      })
      return NextResponse.json({
        success: false,
        message: `Internal Server Error`
      }, {
        status: 500
      })
    }
  }) as T
}
