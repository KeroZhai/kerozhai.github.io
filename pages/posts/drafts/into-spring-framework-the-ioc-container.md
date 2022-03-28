---
title: Into Spring Framework - The IoC Container
---

## 什么是 IoC 容器？

如前所述，Spring Framework 提供了很多核心功能，在这些功能中，最重要的就是 IoC 容器。从某种程度上来说，可以说 Spring Framework 就是一个 IoC 容器。

### IoC

IoC，全称 Inversion of Control，是一种设计思想，翻译成中文就是“控制反转”，也被熟知为依赖注入（Dependency Injection，DI）。

在应用中会有各种各样的对象，其中一些对象需要**依赖**其他对象才能正常工作，例如有一个代表车的类，它依赖了引擎：

```java
public class Car {
    private SuperEngine engine;

    public Car() {
        this.engine = new SuperEngine();
    }
}
```

我们在构造方法中**显式、主动地**实例化了所依赖的对象，也即 `Car` 这个类直接依赖了 `SuperEngine` 这个类。如果在 IoC 场景中，我们可能会写成：

```java
public class Car {
    private Engine engine; // 一般是接口类

    public Car(Engine engine) {
        this.engine = engine;
    }
}
```

这里类 `Car` 依赖了 `Engine` 这个接口类，但并没有明确依赖哪个**具体的实现类**，相反，我们可以在实例化类 `Car` 时将依赖传递进去：

```java
SuperEngine superEngine = new SuperEngine(); // SuperEngine 实现了 Engine 接口
Car car = new Car(superEngine);
```

在上面第一段代码中，类 `Car` 所依赖的对象是由它自己所决定并实例化的，而在第二段代码中，这种**控制**被**反转**了，依赖是被**注入**进去的。

### 容器

简单来说，容器就是用于*存放*对象的一个地方。

有了容器之后，我们就不需要实例化对象，而是从容器中获取，换句话说，容器负责创建我们所需要的对象。对象的依赖关系（即所依赖的其他对象）通过构造方法参数（也即上面第二段代码所示）、（实例化它们的）工厂方法参数或者在对象被实例化或从工厂方法返回后要被设置的属性来定义，当容器创建对象时，就会把这些依赖**注入**其中。

## Spring 中的实现

### Spring IoC 容器和 Bean

包 `org.springframework.beans` 和 `org.springframework.context` 是 Spring IoC 容器的基础。接口类 `BeanFactory` 提供了一种高级配置机制，能够管理任何类型的对象，而 `ApplicationContext` 是其子接口，添加了以下内容：

* 更容易和 Spring 的 AOP 功能集成
* 消息资源处理（用于国际化）
* 事件发布
* 应用层特定的上下文，例如用于 Web 应用的 `WebApplicationContext`

简言之，`BeanFactory` 提供了配置框架和基础功能，而 `ApplicationContext` 增加了更多复杂应用特定的功能。

`ApplicationContext` 是 `BeanFactory` 的完整超集，在本章中专门用于描述 Spring 的 IoC 容器。关于 `BeanFactory` 的使用详见 BeanFactory。

在 Spring 中，构成应用主干并由 Spring IoC 容器管理的对象统称为 Bean。一个 Bean 就是一个被 Spring IoC 容器实例化、组装和管理的对象。Bean 和它们的依赖体现在容器所使用的配置元数据中。

这里的 Bean 不同于 JavaBean。JavaBean 是一个标准，它规定如果一个类满足下列要求，则是一个 JavaBean：

* 所有的属性都是私有的，需要使用 getters/setters 访问；
* 有一个公共的无参构造方法；
* 实现了 `Serializable` 接口。

> Java 名称来源于一个盛产咖啡豆的小岛（所以 Java 的图标是一杯咖啡），而 bean 直译为豆子，所以 JavaBean 其实就是咖啡豆。此外，如果查看 Java 编译后生成的 class 文件的二进制信息，可以看到前四个字节的值为“cafe babe”。

### 容器概述

接口 `org.springframework.context.ApplicationContext` 代表着 Spring IoC 容器，并通过读取*配置元数据*来实例化、配置和组装 bean。配置元数据可以通过 XML、Java 注解或 Java 代码来提供，主要用于表示组成应用的对象以及它们之间的依赖关系。

除了 `ApplicationContext` 接口以外，Spring 也附带了几个它的实现类。在单应用中，常见的做法是创建一个 `ClassPathXmlApplicationContext` 或者 `FileSystemXmlApplicationContext`。虽然 XML 一直是定义配置元数据的传统格式，但我们可以通过提供少量 XML 配置来以声明方式支持额外的元数据格式，即使用 Java 注解或者代码。

在大多数应用场景下，并不需要明确的用户代码去实例化一个或多个 IoC 容器。例如，在一个 Web 应用场景下，应用的 web.xml 中简单的 8 行左右的模板 Web 描述 XML 代码通常就足够了（详见 Convenient ApplicationContext Instantiation for Web Applications）。

下图显示了 Spring 如何工作的高级视图。应用的类结合了配置元数据，因此当 `ApplicationContext` 被创建和实例化后，就会有一个完全配置且可运行的系统或应用。

![container-magic](/images/into-spring-framework-the-ioc-container/container-magic.png "container-magic")

#### 配置元数据

如前所述，配置元数据传统上以简单直观的 XML 格式提供，但如今已经很少使用了，因此我们不会详细介绍它。

##### 基于 XML 的配置元数据

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="car" class="com.foo.Car">
        <!-- collaborators and configuration for this bean go here -->
        <property name="engine" autowire="byType">
    </bean>

    <bean id="superEngine" class="com.foo.SuperEngine">
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions go here -->
</beans>
```

##### 基于注解的配置元数据

```java
package com.foo;

@Component
public class Car {
    // ...
}
```

```java
@Configuration
@ComponentScan(basePackages = "com.foo")
public class AppConfiguration {
}
```

##### 基于 Java 的配置元数据

```java
package com.foo;

public class Car {
    // ...
}


```





本章大部分内容都使用这种格式来传达 Spring IoC 容器的关键概念和特性。

Spring 配置由至少一个需要由容器管理的 bean 定义。基于 XML 的配置元数据将这些 bean 配置为顶级 `<beans/>` 元素内的 `<bean/>` 元素，而 Java 配置通常通过配置类（标注了 `@Configuration` 的类）中标注了 `@Bean` 注解的方法来配置。

这些 bean 定义对应着组成应用的实际的对象。通常，我们会定义服务层对象、数据访问对象（Data Access Object, DAO）、表示层对象、基础设施对象（例如 Hibernate `SessionFactories` ）等。我们不会在容器中配置细粒度的领域对象（Domain Object），因为创建和加载领域对象通常是 DAO 和业务逻辑的责任。然而，我们也可以使用 Spring 和 AspectJ 的集成来配置那些在 IoC 容器控制外被创建的对象。详见 在 Spring 中使用 AspectJ 来将依赖注入到领域对象中。

下面的示例展示了基于 XML 的配置元数据的基本结构：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <bean id="..." class="...">
        <!-- collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions go here -->

</beans>
```

> `id` 属性用于标识唯一的 bean 定义，`class` 属性通过全限定类名定义 bean 的类型。

#### 初始化容器

提供给 ApplicationContext 构造方法的一个或多个位置路径是资源字符串，允许容器从各种外部资源（例如本地文件系统、Java CLASSPATH 等）加载配置元数据。

```java
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");
```

下面的示例展示了服务层对象配置文件（`services.xml`）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- services -->

    <bean id="petStore" class="org.springframework.samples.jpetstore.services.PetStoreServiceImpl">
        <property name="accountDao" ref="accountDao"/>
        <property name="itemDao" ref="itemDao"/>
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for services go here -->

</beans>
```

下面的示例展示了数据访问对象配置文件（`daos.xml`）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="accountDao"
        class="org.springframework.samples.jpetstore.dao.jpa.JpaAccountDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <bean id="itemDao" class="org.springframework.samples.jpetstore.dao.jpa.JpaItemDao">
        <!-- additional collaborators and configuration for this bean go here -->
    </bean>

    <!-- more bean definitions for data access objects go here -->

</beans>
```

在前面的示例中，服务层由 `PetStoreServiceImpl` 类和类型为 `JpaAccountDao` 和 `JpaItemDao` 的两个数据访问对象组成。`property` 元素的 `name` 属性指的是 JavaBean 的属性名，而 `ref` 指的是另一个 bean 定义的名称。`id` 和 `ref` 之间的这种联系表达了协作对象之间的依赖关系。

##### 编写基于 XML 的配置元数据

将 bean 定义分散到多个 XML 文件中是一个比较好用的做法，通常每一个独立的 XML 配置文件表示着应用架构中的一个逻辑层或模块。

我们可以使用应用上下文构造方法来加载这些 XML 配置文件，构造方法接收一个或多个资源路径。也可以通过使用 `<import/>` 元素来从其他文件中加载 bean 定义，例如：

```xml
<beans>
    <import resource="services.xml"/>
    <import resource="resources/messageSource.xml"/>
    <import resource="/resources/themeSource.xml"/>

    <bean id="bean1" class="..."/>
    <bean id="bean2" class="..."/>
</beans>
```

在上面的例子中，外部 bean 定义从三个文件中加载，所有的路径都是相对于当前文件的，同时，前导斜杠（`/`）会被自动忽略。然而，考虑到这些都是相对路径，最好直接就不要添加前导斜杠。被导入的文件和 `<beans/>` 元素本身必须是符合 Spring Schema 的合法 XML 代码。

当前命名空间提供了导入指令功能，此外，通过选择 Spring 提供的其他 XML 命名空间也可以使用更多的配置功能，例如命名空间 `context` 和 `util`。

#### 使用容器

`ApplicationContext` 是高级工厂的接口，能够维护不同 bean 及其依赖项的注册表。可以通过使用方法 `T getBean(String name, Class<T> requiredType)` 来获取 bean 实例。`ApplicationContext` 允许我们读取并访问 bean 定义，例如：

```java
// create and configure beans
ApplicationContext context = new ClassPathXmlApplicationContext("services.xml", "daos.xml");

// retrieve configured instance
PetStoreService service = context.getBean("petStore", PetStoreService.class);

// use configured instance
List<String> userList = service.getUsernameList();
```

除了 `getBean()` 方法以外，`ApplicationContext` 接口也提供了一些其他的方法，但是理想情况下，应用代码不应该使用它们。实际上，应用代码甚至都不应该调用 `getBean()` 方法，从而完全不依赖 Spring 的 API。例如，Spring 与 Web 框架的集成为各种 Web 框架组件（例如控制器和 JSF 管理的 bean）提供了依赖注入，让我们可以通过元数据（例如自动装配注解）声明对特定 bean 的依赖。

### Bean 概述

在容器中，bean 的定义表示为 `BeanDefinition` 对象，它包含了以下元数据（还有一些别的信息）：

* 一个包限定的类名：通常是被定义的 bean 的实际实现类；
* Bean 行为配置元素，它说明 bean 在容器中的行为方式（范围、生命周期回调等）。
* 对 bean 完成工作所需的其他 bean 的引用。这些引用也被称为协作者或者依赖。
* 其他的一些用于配置新创建好的对象的设定，例如，配置一个管理连接池的对象所要使用的池大小限制或者连接的数量。

此元数据转换为组成每个 bean 定义的一组属性，下面的表格描述了这些属性：

| Property | Explained in... |
| --- | --- |
| Class |  |
| Name | [为 bean 命名](#为-bean-命名) |
| Scope | 2 |
| Constructor arguments | 2 |
| Properties | 2 |
| Autowiring mode | 2 |
| Lazy initialization mode | 2 |
| Initialization method | 2 |
| Destruction method | 2 |

除了包含如何创建一个特定的 bean 的信息的 bean 定义以外，`ApplicationContext` 的实现类也允许注册（由用户）创建于容器外的、已存在的对象。通过调用 `getBeanFactory()` 方法，会返回实现了 `BeanFactory` 接口的 `DefaultListableBeanFactory` 对象，它支持通过 `registerSingleton(...)` 和 `registerBeanDefinition(...)` 方法来注册。但是，典型的应用程序仅使用通过常规 bean 定义元数据定义的 bean。

#### 为 bean 命名