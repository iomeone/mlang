import { Token } from "../token";
import { Expression } from "./base";

export class AssignExpression extends Expression {
  name: Token;
  expression: Expression;

  constructor(name: Token, expression: Expression) {
    super();

    this.name = name;
    this.expression = expression;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitAssignExpression(this);
  }
}

export class BinaryExpression extends Expression {
  left: Expression;
  operator: Token;
  right: Expression;

  constructor(left: Expression, operator: Token, right: Expression) {
    super();

    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitBinaryExpression(this);
  }
}

export class CallExpression extends Expression {
  callee: Expression;
  arguments: Expression[];

  constructor(callee: Expression, args: Expression[]) {
    super();

    this.callee = callee;
    this.arguments = args;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitCallExpression(this);
  }
}

export class GetExpression extends Expression {
  object: Expression;
  name: Token;

  constructor(object: Expression, name: Token) {
    super();

    this.object = object;
    this.name = name;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitGetExpression(this);
  }
}

export class GroupingExpression extends Expression {
  expression: Expression;

  constructor(expression: Expression) {
    super();

    this.expression = expression;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitGroupingExpression(this);
  }
}

export class LiteralExpression extends Expression {
  value: string | number | boolean | undefined;

  constructor(value: string | number | boolean | undefined) {
    super();

    this.value = value;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitLiternalExpression(this);
  }
}

export class LogicalExpression extends Expression {
  left: Expression;
  opeartor: Token;
  right: Expression;

  constructor(left: Expression, operator: Token, right: Expression) {
    super();

    this.left = left;
    this.opeartor = operator;
    this.right = right;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitLogicalExpression(this);
  }
}

export class SetExpression extends Expression {
  object: Expression;
  name: Token;
  expression: Expression;

  constructor(object: Expression, name: Token, expression: Expression) {
    super();

    this.object = object;
    this.name = name;
    this.expression = expression;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitSetExpression(this);
  }
}

export class SuperExpression extends Expression {
  name: Token;
  method: Token;

  constructor(name: Token, method: Token) {
    super();

    this.name = name;
    this.method = method;
  }
}

export class ThisExpression extends Expression {
  keyword: Token;

  constructor(keyword: Token) {
    super();

    this.keyword = keyword;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitThisExpression(this);
  }
}

export class UnaryExpression extends Expression {
  opeartor: Token;
  right: Expression;

  constructor(operator: Token, right: Expression) {
    super();

    this.opeartor = operator;
    this.right = right;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitUnaryExpression(this);
  }
}

export class VarExpression extends Expression {
  name: Token;

  constructor(name: Token) {
    super();

    this.name = name;
  }

  accept(vistor: ExpressionVistor) {
    vistor.visitVarExpression(this);
  }
}

export abstract class ExpressionVistor {
  abstract visitAssignExpression(expr: AssignExpression);
  abstract visitBinaryExpression(expr: BinaryExpression);
  abstract visitCallExpression(expr: CallExpression);
  abstract visitGetExpression(expr: GetExpression);
  abstract visitGroupingExpression(expr: GroupingExpression);
  abstract visitLiternalExpression(expr: LiteralExpression);
  abstract visitLogicalExpression(expr: LogicalExpression);
  abstract visitSetExpression(expr: SetExpression);
  abstract visitSuperExpression(expr: SuperExpression);
  abstract visitThisExpression(expr: ThisExpression);
  abstract visitUnaryExpression(expr: UnaryExpression);
  abstract visitVarExpression(expr: VarExpression);
}
