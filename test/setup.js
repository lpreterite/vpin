import jsdom from 'jsdom-global'
import { expect } from "chai"

jsdom()

global.expect = expect